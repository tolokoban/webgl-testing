import {
    IUniformSetter,
    IUniformTypes,
    IUniformType,
    IWebGL
} from '../types'

export default class UniformSetter {
    private uniformSetters = new Map<string, IUniformSetter>()

    constructor(
        gl: IWebGL,
        prg: WebGLProgram,
        private uniformsDefinition: IUniformTypes
    ) {
        this.attachProgram(gl, prg)
    }

    set(name: string, value: number | Float32Array | Int32Array) {
        const setter = this.uniformSetters.get(name)
        if (!setter) return
        setter(value as any)
    }

    exists(name: string): boolean {
        return this.uniformSetters.has(name)
    }

    private attachProgram(gl: IWebGL, prg: WebGLProgram) {
        for (const uniformName of Object.keys(this.uniformsDefinition)) {
            const location: WebGLUniformLocation | null =
                gl.getUniformLocation(prg, uniformName)
            if (!location) {
                displayWarningForNotFoundUniform(uniformName)
                continue
            }

            const uniformType = this.uniformsDefinition[uniformName]
            const isArray = uniformType.size && uniformType.size > 1 ? true : false

            switch (uniformType.type) {
                case IUniformType.BYTE:
                case IUniformType.UNSIGNED_BYTE:
                case IUniformType.SHORT:
                case IUniformType.UNSIGNED_SHORT:
                case IUniformType.INT:
                case IUniformType.UNSIGNED_INT:
                case IUniformType.SAMPLER_2D: // For 2D textures, we specify the texture unit.
                case IUniformType.SAMPLER_CUBE: // For CubeMap textures, we specify the texture unit.
                    this.attachProgramInt(gl, prg, uniformName, isArray)
                    break
                case IUniformType.FLOAT:
                    this.attachProgramFloat(gl, prg, uniformName, isArray)
                    break
                case IUniformType.FLOAT_VEC2:
                    this.attachProgramVec2(gl, prg, uniformName, isArray)
                    break
                case IUniformType.FLOAT_VEC3:
                    this.attachProgramVec3(gl, prg, uniformName, isArray)
                    break
                case IUniformType.FLOAT_VEC4:
                    this.attachProgramVec4(gl, prg, uniformName, isArray)
                    break
                case IUniformType.FLOAT_MAT2:
                    this.attachProgramMat2(gl, prg, uniformName, isArray)
                    break
                case IUniformType.FLOAT_MAT3:
                    this.attachProgramMat3(gl, prg, uniformName, isArray)
                    break
                case IUniformType.FLOAT_MAT4:
                    this.attachProgramMat4(gl, prg, uniformName, isArray)
                    break
                default:
                    throw Error(`[AbstractShader.attachProgram] Unknown type for uniform "${uniformName}": ${uniformType.type}[${uniformType.size || 1}]!`)
            }
        }
    }

    private attachProgramInt(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            isArray ?
                (v: Int32Array) => gl.uniform1iv(location, v) :
                (v: number) => gl.uniform1i(location, v)
        )
    }

    private attachProgramFloat(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            isArray ?
                (v: Float32Array) => gl.uniform1fv(location, v) :
                (v: number) => gl.uniform1f(location, v)
        )
    }

    private attachProgramVec2(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        if (isArray) throw Error("You cannot use array of vec2!")
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            (v: Float32Array) => gl.uniform2fv(location, v)
        )
    }

    private attachProgramVec3(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        if (isArray) throw Error("You cannot use array of vec3!")
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            (v: Float32Array) => gl.uniform3fv(location, v)
        )
    }

    private attachProgramVec4(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        if (isArray) throw Error("You cannot use array of vec4!")
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            (v: Float32Array) => gl.uniform4fv(location, v)
        )
    }

    private attachProgramMat2(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        if (isArray) throw Error("You cannot use array of mat2!")
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            (v: Float32Array) => gl.uniformMatrix2fv(location, false, v)
        )
    }

    private attachProgramMat3(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        if (isArray) throw Error("You cannot use array of mat3!")
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            (v: Float32Array) => gl.uniformMatrix3fv(location, false, v)
        )
    }

    private attachProgramMat4(
        gl: IWebGL,
        prg: WebGLProgram,
        uniformName: string,
        isArray: boolean
    ) {
        if (isArray) throw Error("You cannot use array of mat4!")
        const location = gl.getUniformLocation(prg, uniformName)
        this.uniformSetters.set(
            uniformName,
            (v: Float32Array) => gl.uniformMatrix4fv(location, false, v)
        )
    }
}

function displayWarningForNotFoundUniform(uniformName: string) {
    console.warn(`Uniform "${uniformName}" has not been compiled in this program!`)
    console.warn("Shader compilation removes everything that is not used by the code.")
}
