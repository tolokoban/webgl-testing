import Texture from './texture'
import { IWebGL } from '../../types'

export interface IImageTextureParams {
    id: string,
    gl: IWebGL,
    source: HTMLImageElement | HTMLCanvasElement,
    width: number,
    height: number,
    linear: boolean
}

export default class ImageTexture extends Texture {
    constructor(private readonly params: IImageTextureParams) {
        super(params.gl, params.id, "2d")

        const { gl } = params
        const smoothness = params.linear ? gl.LINEAR : gl.NEAREST
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, smoothness)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, smoothness)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, params.source)
    }

    get width() { return this.params.width }
    get height() { return this.params.height }

    update(source: HTMLImageElement | HTMLCanvasElement) {
        const { gl } = this.params
        gl.bindTexture(gl.TEXTURE_2D, this.texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    }
}
