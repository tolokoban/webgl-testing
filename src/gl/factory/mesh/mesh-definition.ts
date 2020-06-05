export interface IMeshDefinition {
    name: string
    vertices: number[]
    textures: number[]
    normals: number[]
    faces: number[]
    smoothness: string
}

const VERTICES_PER_FACE = 3
const VALUES_PER_VERTEX = 3
const VALUES_PER_TEXTURE = 2
const VALUES_PER_NORMAL = 3
const VALUES_PER_FACE_VERTEX = 3
const VALUES_PER_FACE = VALUES_PER_FACE_VERTEX * VERTICES_PER_FACE

const X = 0
const Y = 1
const Z = 2
const U = 0
const V = 1
const VER = 0
const TEX = 1
const NOR = 2

export default class MeshDefinition {
    public readonly id: string
    public readonly verticesCount: number
    public readonly texturesCount: number
    public readonly normalsCount: number
    public readonly facesCount: number

    constructor(id: string, private def: IMeshDefinition) {
        this.id = id
        this.verticesCount = Math.floor(def.vertices.length / VALUES_PER_VERTEX)
        this.texturesCount = Math.floor(def.textures.length / VALUES_PER_TEXTURE)
        this.normalsCount = Math.floor(def.normals.length / VALUES_PER_NORMAL)
        this.facesCount = Math.floor(def.faces.length / VALUES_PER_FACE)
    }

    getVertexX(index: number): number {
        ensureIndexInRange(index, this.verticesCount)
        return this.def.vertices[index * VALUES_PER_VERTEX + X]
    }

    getVertexY(index: number): number {
        ensureIndexInRange(index, this.verticesCount)
        return this.def.vertices[index * VALUES_PER_VERTEX + Y]
    }

    getVertexZ(index: number): number {
        ensureIndexInRange(index, this.verticesCount)
        return this.def.vertices[index * VALUES_PER_VERTEX + Z]
    }

    getTextureU(index: number): number {
        ensureIndexInRange(index, this.texturesCount)
        return this.def.textures[index * VALUES_PER_TEXTURE + U]
    }

    getTextureV(index: number): number {
        ensureIndexInRange(index, this.texturesCount)
        return this.def.textures[index * VALUES_PER_TEXTURE + V]
    }

    getNormalX(index: number): number {
        ensureIndexInRange(index, this.normalsCount)
        return this.def.normals[index * VALUES_PER_NORMAL + X]
    }

    getNormalY(index: number): number {
        ensureIndexInRange(index, this.normalsCount)
        return this.def.normals[index * VALUES_PER_NORMAL + Y]
    }

    getNormalZ(index: number): number {
        ensureIndexInRange(index, this.normalsCount)
        return this.def.normals[index * VALUES_PER_NORMAL + Z]
    }

    getFaceSmoothness(index: number): boolean {
        ensureIndexInRange(index, this.facesCount)
        return this.def.smoothness.charAt(index) === '1'
    }

    getFaceVertex(faceIdx: number, pointIdx: number): number {
        ensureIndexInRange(faceIdx, this.facesCount)
        const idx = faceIdx * VALUES_PER_FACE
            + VALUES_PER_FACE_VERTEX * pointIdx
            + VER
        return this.def.faces[idx]
    }

    getFaceTexture(faceIdx: number, pointIdx: number): number {
        ensureIndexInRange(faceIdx, this.facesCount)
        const idx = faceIdx * VALUES_PER_FACE
            + VALUES_PER_FACE_VERTEX * pointIdx
            + TEX
        return this.def.faces[idx]
    }

    getFaceNormal(faceIdx: number, pointIdx: number): number {
        ensureIndexInRange(faceIdx, this.facesCount)
        const idx = faceIdx * VALUES_PER_FACE
            + VALUES_PER_FACE_VERTEX * pointIdx
            + NOR
        return this.def.faces[idx]
    }
}


/**
 * Throw an exception is index is out of range.
 */
function ensureIndexInRange(index: number, upperLimit: number) {
    if (index < 0 || index >= upperLimit) {
        throw `Index ${index} is out of range [0..${upperLimit - 1}]!`
    }
}
