import Common from '../common'
import Scene from '../../../scene'
import Camera from '../../../camera'
import Program from '../../../program'
import Transfo from '../../../transfo'
import FresnelMesh from '../../../mesh/fresnel'
import MeshDefinition from '../mesh-definition'

import MainVertShader from './main.vert'
import MainFragShader from './main.frag'

export default { createAsync }

const ATTRIBUTE_PER_VERTEX = 8

interface IParams {
    scene: Scene
    definitionURL: string
    colorTextureURL: string
}

async function createAsync(transfo: Transfo, params: IParams): Promise<FresnelMesh> {
    const { scene, definitionURL, colorTextureURL } = params
    const { camera } = scene
    const id = `[FRESNEL]:${definitionURL}`
    const meshDef = await Common.createOrGetFromCacheMeshDefinition(definitionURL)
    const data = createData(meshDef)
    const attributesCount = Math.floor(data.length / ATTRIBUTE_PER_VERTEX)
    const arrayBuffer = scene.buffers.createArrayBuffer(id, data)
    const colorTexture = await scene.textures.createImageTextureAsync({
        url: colorTextureURL,
        linear: false
    })
    const program = await createProgramAsync(scene, camera)
    return new FresnelMesh({
        scene: params.scene,
        transfo,
        arrayBuffer,
        attributesCount,
        colorTexture,
        program
    })
}


async function createProgramAsync(scene: Scene, camera: Camera): Promise<Program> {
    const id = `[FRESNEL]:${camera.id}`
    const program = await scene.programs.createProgramAsync(
        id,
        {
            uniforms: {
                uniObjectTransfo: "mat4"
            },
            attributes: {
                attLocation: "vec3",
                attUV: "vec2",
                attNormal: "vec3"
            },
            varyings: {
                varNormal: "vec3",
                varReflexion: "vec3",
                varUV: "vec2"
            },
            functions: { main: MainVertShader },
            dependencies: [camera.vertexShader]
        },
        {
            uniforms: {
                uniTexture: "sampler2D"
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
    const POINTS_PER_FACE = 3

    for (let faceIdx = 0; faceIdx < meshDef.facesCount; faceIdx++) {
        for (let pointIdx = 0; pointIdx < POINTS_PER_FACE; pointIdx++) {
            const vertexIdx = meshDef.getFaceVertex(faceIdx, pointIdx)
            data.push(
                meshDef.getVertexX(vertexIdx),
                meshDef.getVertexY(vertexIdx),
                meshDef.getVertexZ(vertexIdx)
            )
            const textureIdx = meshDef.getFaceTexture(faceIdx, pointIdx)
            data.push(
                meshDef.getTextureU(textureIdx),
                meshDef.getTextureV(textureIdx)
            )
            const normalIdx = meshDef.getFaceNormal(faceIdx, pointIdx)
            data.push(
                meshDef.getNormalX(normalIdx),
                meshDef.getNormalY(normalIdx),
                meshDef.getNormalZ(normalIdx)
            )
        }
    }

    return new Float32Array(data)
}
