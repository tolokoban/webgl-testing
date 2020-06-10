import AssetsMap from '../../assets-map'
import ArrayBuffer from '../../buffer/array-buffer'
import { IWebGL } from '../../types'

export default class BufferFactory {
    private arrayBufferMap = new AssetsMap<ArrayBuffer>()

    constructor(private gl: IWebGL) { }

    createArrayBuffer(id: string, data: Float32Array): ArrayBuffer {
        return this.arrayBufferMap.add(
            id,
            () => {
                const { gl } = this
                const buffer = gl.createBuffer()
                if (!buffer) {
                    throw Error("Unable to create a new WebGLBuffer!")
                }
                const arrayBuffer = new ArrayBuffer({
                    gl, buffer,
                    confirmDestroy: () => this.arrayBufferMap.remove(id) === 0
                })
                arrayBuffer.setData(data)
                return arrayBuffer
            }
        )
    }
}
