import { IWebGL } from '../../types'
import Program from '../../program'
import Texture from '../texture'

export default class Model {
    public readonly gl: IWebGL
    public readonly buffer: WebGLBuffer
    public readonly program: Program
    public readonly texture: Texture
    public readonly attributesCount: number
    public readonly name: string

    constructor(params: IModelParams) {
        if (!params.buffer) throw Error("'buffer' is not defined!")
        console.info("params=", params)
        this.gl = params.gl
        this.name = params.name
        this.buffer = params.buffer
        this.program = params.program
        this.texture = params.texture
        this.attributesCount = params.attributesCount
    }

    paint() {
        const { gl, buffer, program, texture, attributesCount } = this
        const thickness = 0.05
        const smoothness = 1

        program.use()
        texture.attachToUnit(0)
        program.uniforms.set("uniTexture", 0)
        program.uniforms.set("uniThickness", thickness * (1 - smoothness))
        program.uniforms.set("uniSmoothness", thickness * smoothness)
        program.bindAttribs(buffer)
        gl.drawArrays(gl.TRIANGLES, 0, attributesCount)
    }
}

interface IModelParams {
    attributesCount: number
    buffer: WebGLBuffer
    gl: IWebGL
    name: string
    program: Program
    texture: Texture
}
