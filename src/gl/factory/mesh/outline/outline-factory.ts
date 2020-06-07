import Common from '../common'
import Scene from '../../../scene'
import Program from '../../../program'
import OutlineMesh from '../../../mesh/outline'
import MeshDefinition from '../mesh-definition'
import Transfo from '../../../transfo'

import MainVertShader from './main.vert'
import MainFragShader from './main.frag'

export default { createAsync }

const ATTRIBUTE_PER_VERTEX = 6

interface IParams {
    scene: Scene
    transfo: Transfo
    definitionURL: string
}

async function createAsync(params: IParams): Promise<OutlineMesh> {
    const { scene, definitionURL } = params
    const id = `[OUTLINE]:${definitionURL}`
    const meshDef = await Common.createOrGetFromCacheMeshDefinition(definitionURL)
    const data = createData(meshDef)
    const attributesCount = Math.floor(data.length / ATTRIBUTE_PER_VERTEX)
    const arrayBuffer = scene.buffers.createArrayBuffer(id, data)
    const program = await createProgramAsync(scene)
    return new OutlineMesh({
        scene,
        transfo: params.transfo,
        arrayBuffer,
        attributesCount,
        program
    })
}


async function createProgramAsync(scene: Scene): Promise<Program> {
    const { camera } = scene
    const id = `[OUTLINE]:${camera.id}`
    const program = await scene.programs.createProgramAsync(
        id,
        {
            uniforms: {
                uniObjectTransfo: "mat4",
                uniThickness: "float"
            },
            attributes: {
                attLocation: "vec3",
                attNormal: "vec3"
            },
            functions: { main: MainVertShader },
            dependencies: [camera.vertexShader]
        },
        {
            uniforms: {
                uniColor: "vec4"
            },
            functions: { main: MainFragShader }
        }
    )
    return program
}


/**
 * Each vertex has the following attributes:
 * float vertexX
 * float vertexY
 * float vertexZ
 * float textureU
 * float textureV
 * float normalX
 * float normalY
 * float normalZ
 */
function createData(meshDef: MeshDefinition): Float32Array {
    const data: number[] = []
    const vertices: Vertex[] = []
    const POINTS_PER_FACE = 3

    for (let faceIdx = 0; faceIdx < meshDef.facesCount; faceIdx++) {
        for (let pointIdx = 0; pointIdx < POINTS_PER_FACE; pointIdx++) {
            const vertexIdx = meshDef.getFaceVertex(faceIdx, pointIdx)
            if (!vertices[vertexIdx]) {
                vertices[vertexIdx] = new Vertex(
                    meshDef.getVertexX(vertexIdx),
                    meshDef.getVertexY(vertexIdx),
                    meshDef.getVertexZ(vertexIdx)
                )
            }
            const vertex = vertices[vertexIdx]
            const normalIdx = meshDef.getFaceNormal(faceIdx, pointIdx)
            vertex.addNormal(
                meshDef.getNormalX(normalIdx),
                meshDef.getNormalY(normalIdx),
                meshDef.getNormalZ(normalIdx)
            )
        }
    }

    for (let faceIdx = 0; faceIdx < meshDef.facesCount; faceIdx++) {
        for (let pointIdx = 0; pointIdx < POINTS_PER_FACE; pointIdx++) {
            const vertexIdx = meshDef.getFaceVertex(faceIdx, pointIdx)
            const vertex = vertices[vertexIdx]
            data.push(...vertex.data)
        }
    }

    console.info("data=", data)
    return new Float32Array(data)
}

class Vertex {
    private normalX = 0
    private normalY = 0
    private normalZ = 0
    private normalsCount = 0

    constructor(private x: number, private y: number, private z: number) { }

    addNormal(x: number, y: number, z: number) {
        this.normalX += x
        this.normalY += y
        this.normalZ += z
        this.normalsCount++
    }

    get data() {
        const n = Math.max(1, this.normalsCount)
        const nx = this.normalX / n
        const ny = this.normalY / n
        const nz = this.normalZ / n
        const lenInv = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz)

        return [
            this.x,
            this.y,
            this.z,
            nx * lenInv,
            ny * lenInv,
            nz * lenInv
        ]
    }
}
