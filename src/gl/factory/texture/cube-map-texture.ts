import Texture from './texture'

export interface ICubeMapTextureParams {
    id: string,
    gl: WebGL2RenderingContext,
    sourcePosX: HTMLImageElement | HTMLCanvasElement,
    sourceNegX: HTMLImageElement | HTMLCanvasElement,
    sourcePosY: HTMLImageElement | HTMLCanvasElement,
    sourceNegY: HTMLImageElement | HTMLCanvasElement,
    sourcePosZ: HTMLImageElement | HTMLCanvasElement,
    sourceNegZ: HTMLImageElement | HTMLCanvasElement
}

export default class CubeMapTexture extends Texture {
    constructor(params: ICubeMapTextureParams) {
        super(params.gl, params.id, "cubeMap")

        const { gl } = params
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture)

        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            params.sourcePosX)
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            params.sourceNegX)
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            params.sourcePosY)
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            params.sourceNegY)
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            params.sourcePosZ)
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
            params.sourceNegZ)

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    }
}
