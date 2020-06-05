import { IWebGL } from '../types'

interface IArrayBufferParams {
    gl: IWebGL
    buffer: WebGLBuffer
    confirmDestroy(): boolean
}

export default class ArrayBuffer {
    constructor(private params: IArrayBufferParams) { }

    setData(data: Float32Array) {
        const { gl, buffer } = this.params
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }

    get buffer(): WebGLBuffer { return this.params.buffer }

    bind() {
        const { gl, buffer } = this.params
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    }

    destroy() {
        const { gl, buffer, confirmDestroy } = this.params
        if (confirmDestroy() === false) return
        gl.deleteBuffer(buffer)
    }
}
