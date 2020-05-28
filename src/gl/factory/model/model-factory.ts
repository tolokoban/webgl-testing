// tslint:disable:no-magic-numbers
import Scene from '../../scene'
import Model from './model'
import AssetsMap from '../../assets-map'
import AsyncLoader from '../../async-loader'
import Texture from '../texture/texture'
import Program from '../../program'
import ModelShader from '../../shader/model'

import PaletteTextureUrl from '../../assets/palette/default-64.png'

interface IModelInfo {
    buffer: WebGLBuffer
    attributesCount: number
    name: string
}

export default class ModelsFactory {
    private infoMap = new AssetsMap<IModelInfo>()
    private programMap = new AssetsMap<Program>()
    private textureMap = new AssetsMap<Texture>()

    constructor(private scene: Scene) { }

    async createAsync(url: string): Promise<Model> {
        const { scene } = this
        const { infoMap, programMap, textureMap } = this

        if (!infoMap.exists(url)) await this.createInfo(url)
        if (!programMap.exists(url)) await this.createProgram("model")
        if (!textureMap.exists(url)) await this.createTexture(PaletteTextureUrl)

        const info = infoMap.get(url) as IModelInfo
        return new Model({
            gl: scene.gl,
            name: info.name,
            attributesCount: info.attributesCount,
            buffer: info.buffer,
            program: programMap.get("model") as Program,
            texture: textureMap.get(PaletteTextureUrl) as Texture
        })
    }

    private async createInfo(url: string): Promise<IModelInfo> {
        const gl = this.scene.gl
        const modelDef = (await AsyncLoader.loadJson(url)) as IMesh
        const modelBuff = gl.createBuffer()
        if (!modelBuff) throw Error("Unable to create a new WebGLBuffer!")
        const modelData = createTriangles(modelDef.data)
        gl.bindBuffer(gl.ARRAY_BUFFER, modelBuff)
        gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW)
        const modelInfo: IModelInfo = {
            attributesCount: Math.floor(modelDef.data.length / modelDef.attributes.length),
            buffer: modelBuff,
            name: modelDef.name
        }
        this.infoMap.add(url, modelInfo)
        return modelInfo
    }

    private async createProgram(id: string): Promise<Program> {
        const gl = this.scene.gl
        const program = new Program(gl, ModelShader.vert, ModelShader.frag)
        this.programMap.add(id, program)
        await program.attach()
        return program
    }

    private async createTexture(url: string): Promise<Texture> {
        const { scene, textureMap } = this
        const texture = await scene.textures.createImageTextureAsync(url)
        textureMap.add(url, texture)
        return texture
    }
}


interface IMesh {
    name: string,
    attributes: string[],
    data: number[]
}


function createTriangles(data: number[], attributesCount: number = 8): Float32Array {
    const result: number[] = []
    let cursor = 0
    const chunkSize = attributesCount * 3
    while (cursor < data.length) {
        const chunk = data.slice(cursor, cursor + chunkSize)
        result.push(...createTriangle(chunk))
        cursor += chunkSize
    }
    return new Float32Array(result)
}

function createTriangle(triCoords: number[]): number[] {
    const [
        ax, ay, az, au, av, nax, nay, naz,
        bx, by, bz, bu, bv, nbx, nby, nbz,
        cx, cy, cz, cu, cv, ncx, ncy, ncz
    ] = triCoords
    const [vBC, vCA, vAB] = [0, 0, 0]
    // PtX, PtY, dist to AB, dist to BC, dist CA.
    const result: number[] = [
        ax, ay, az, au, av, nax, nay, naz, vBC, vCA, vAB, distToEdge(ax, ay, bx, by, cx, cy), 0, 0,
        bx, by, bz, bu, bv, nbx, nby, nbz, vBC, vCA, vAB, 0, distToEdge(bx, by, cx, cy, ax, ay), 0,
        cx, cy, cz, cu, cv, ncx, ncy, ncz, vBC, vCA, vAB, 0, 0, distToEdge(cx, cy, ax, ay, bx, by)
    ]

    return result
}

function squaredDist(ax: number, ay: number, bx: number, by: number): number {
    const x = ax - bx
    const y = ay - by
    return x * x + y * y
}

function dist(ax: number, ay: number, bx: number, by: number): number {
    return Math.sqrt(squaredDist(ax, ay, bx, by))
}

function distToEdge(px: number, py: number, e1x: number, e1y: number, e2x: number, e2y: number): number {
    const edgeLength = dist(e1x, e1y, e2x, e2y)
    if (edgeLength === 0) return 0
    const ux = px - e1x
    const uy = py - e1y
    const vx = e2x - e1x
    const vy = e2y - e1y
    // Cross product casted into 2D.
    // Only the Z axis is non null.
    const cross = ux * vy - uy * vx
    return Math.abs(cross / edgeLength)
}
