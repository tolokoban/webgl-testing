import Shader from '../shader/abstract-shader'
import AsyncLoader from '../async-loader'
import LookupTables from '../lookup-tables'
import UniformSetter from './uniform-setters'

import {
    IAttributeTypes,
    IVaryingTypes,
    IUniformTypes,
    IFunctionTypes,
    IWebGL
} from '../types'


const BPE = Float32Array.BYTES_PER_ELEMENT

interface IWebGLAttribute {
    location: number
    size: number
    type: number
    normalization: boolean
    totalSize: number
    offset: number
}

export default class Program {
    private prg?: WebGLProgram
    public readonly vertexShader: Shader
    public readonly fragmentShader: Shader
    // Attributes ready for binding.
    private attributes: IWebGLAttribute[] = []
    private uniformSetters?: UniformSetter

    constructor(
        private gl: IWebGL,
        vertexShader: Shader,
        fragmentShader: Shader
    ) {
        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
    }

    bindAttribs(buffer: WebGLBuffer) {
        const { gl, prg, attributes } = this
        if (!prg) throw Error("This program has not been attached yet!")

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

        for (const attrib of attributes) {
            gl.enableVertexAttribArray(attrib.location)
            gl.vertexAttribPointer(
                attrib.location,
                attrib.size,
                gl.FLOAT,
                attrib.normalization, // No normalisation.
                attrib.totalSize,
                attrib.offset
            )
        }
    }

    async attach() {
        if (this.prg) this.detach()

        const flatVertShader = flattenShaderDependencies(this.vertexShader)
        const flatFragShader = flattenShaderDependencies(this.fragmentShader)

        // No attributes in fragment shaders.
        flatFragShader.attributes = {}
        // Varying must reflect those of vertex shader.
        flatFragShader.varyings = {
            ...flatVertShader.varyings,
            ...flatFragShader.varyings
        }

        const vertShaderCode = await flatVertShaderToCode(flatVertShader)
        const fragShaderCode = await flatFragShaderToCode(flatFragShader)

        const { gl } = this
        const vertShader = createVertexShader(gl, vertShaderCode)
        const fragShader = createFragementShader(gl, fragShaderCode)

        const prg = gl.createProgram()
        if (!prg) throw Error("Unable to create a new WebGLProgram!")
        this.prg = prg

        gl.attachShader(prg, vertShader)
        gl.attachShader(prg, fragShader)
        gl.linkProgram(prg)

        this.prepareUniformsForFastBinding(flatVertShader.attributes)
        this.uniformSetters = new UniformSetter(
            this.gl, this.prg, {
                ...flatVertShader.uniforms,
                ...flatFragShader.uniforms
            }
        )
    }

    get uniforms(): UniformSetter {
        const { uniformSetters } = this
        if (!uniformSetters) {
            throw Error(
                "Can't get uniforms because the program has not been attached yet!\nprg.attach()"
            )
        }
        return uniformSetters
    }

    detach() {
        const { prg, gl } = this
        if (!prg) return
        gl.deleteProgram(prg)
        delete this.prg
    }

    private prepareUniformsForFastBinding(attDef: IAttributeTypes) {
        const { gl, prg } = this
        if (!prg) throw Error("This program has not been attached yet!")

        const attributes: IWebGLAttribute[] = []
        let offset = 0
        for (const attName of Object.keys(attDef)) {
            const attType = attDef[attName]
            const location = gl.getAttribLocation(prg, attName)
            const attrib: IWebGLAttribute = {
                location,
                offset,
                normalization: false,
                size: LookupTables.getAttributeSize(attType),
                totalSize: 0,
                type: LookupTables.getWebGLTypeFromAttributeType(gl, attType)
            }
            attributes.push(attrib)
            offset += attrib.size * BPE
        }

        const totalSize = offset
        for (const attrib of attributes) {
            attrib.totalSize = totalSize
        }

        this.attributes = attributes
    }

    use() {
        const { prg, gl } = this
        if (!prg) throw Error("This program has not been attached yet!")
        gl.useProgram(prg)
    }
}

function createVertexShader(gl: IWebGL, code: string) {
    return createShader(gl.VERTEX_SHADER, gl, code)
}

function createFragementShader(gl: IWebGL, code: string) {
    return createShader(gl.FRAGMENT_SHADER, gl, code)
}

function createShader(type: number, gl: IWebGL, code: string): WebGLShader {
    if (type !== gl.VERTEX_SHADER && type !== gl.FRAGMENT_SHADER) {
        throw Error('Type must be VERTEX_SHADER or FRAGMENT_SHADER!')
    }
    const shader = gl.createShader(type)
    if (!shader) {
        throw Error(
            `Unable to create a ${type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT'} shader!`
        )
    }
    gl.shaderSource(shader, code)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const errorMessage: string = gl.getShaderInfoLog(shader) || "NULL"
        console.error(`An error occurred compiling the shader with the following code:`)
        // tslint:disable-next-line:no-console
        console.info(writeLineNumbers(code))
        // tslint:disable-next-line:no-console
        console.error(`Here is the error: ${errorMessage}`)
        // tslint:disable-next-line:no-console
        console.info(getCodeSection(code, errorMessage))
        // tslint:disable-next-line:no-console
        throw Error(
            `Unable to create a ${type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT'} shader!`
        )
    }

    return shader
}

async function flatVertShaderToCode(shader: IFlattenedShader): Promise<string> {
    const code: string[] = []
    const uniCode = getUniformsSourceCode(shader.uniforms)
    if (uniCode) code.push(uniCode)
    const attCode = getAttributesSourceCode(shader.attributes)
    if (attCode) code.push(attCode)
    const varCode = getVaryingsSourceCode(shader.varyings)
    if (varCode) code.push(varCode)

    const codeForFunctions = await getFunctionsSourceCode(shader.functions)
    code.push(codeForFunctions)

    return code.join("\n")
}

async function flatFragShaderToCode(shader: IFlattenedShader): Promise<string> {
    const code: string[] = [
        "precision mediump float;"
    ]
    const uniCode = getUniformsSourceCode(shader.uniforms)
    if (uniCode) code.push(uniCode)
    const varCode = getVaryingsSourceCode(shader.varyings)
    if (varCode) code.push(varCode)

    const codeForFunctions = await getFunctionsSourceCode(shader.functions)
    code.push(codeForFunctions)

    return code.join("\n")
}

function getUniformsSourceCode(uniforms: IUniformTypes) {
    return Object.keys(uniforms)
        .map(name => {
            const typeEnum = uniforms[name]
            const type = LookupTables.getUniformTypeCodeName(typeEnum.type)
            if (!type) {
                throw Error(`Unknown type for uniform "${name}": ${typeEnum}!`)
            }
            const arraySuffix =
                (typeEnum.size || 0) > 1 ?
                    `[${typeEnum.size}]` : ""
            return `uniform ${type} ${name}${arraySuffix};`
        })
        .join("\n")
}

function getVaryingsSourceCode(varyings: IVaryingTypes) {
    return Object.keys(varyings)
        .map(name => {
            const typeEnum = varyings[name]
            const type = LookupTables.getVaryingTypeCodeName(typeEnum.type)
            if (!type) {
                throw Error(`Unknown type for varying "${name}": ${typeEnum}!`)
            }
            const arraySuffix =
                (typeEnum.size || 0) > 1 ?
                    `[${typeEnum.size}]` : ""
            return `varying ${type} ${name}${arraySuffix};`
        })
        .join("\n")
}

function getAttributesSourceCode(attributes: IAttributeTypes) {
    return Object.keys(attributes)
        .map(name => {
            const typeEnum = attributes[name]
            const typeString = LookupTables.getAttributeTypeCodeName(typeEnum)
            if (!typeString) {
                throw Error(`Unknown type for attribute "${name}": ${typeEnum}!`)
            }
            return `attribute ${typeString} ${name};`
        })
        .join("\n")
}

async function getFunctionsSourceCode(functions: IFunctionTypes): Promise<string> {
    const code: string[] = []
    const functionNames = Object.keys(functions)

    // Take the functions in reverve order because the dependencies
    // must be declared first.
    while (functionNames.length > 0) {
        const functionName = functionNames.pop()
        if (!functionName) break
        const functionCodeUrlOrArray = functions[functionName]
        if (Array.isArray(functionCodeUrlOrArray)) {
            code.push(...functionCodeUrlOrArray)
        } else {
            const functionCode = await AsyncLoader.loadText(functionCodeUrlOrArray)
            code.push(functionCode)
        }
    }

    return code.join("\n")
}

const RX_ERROR_MESSAGE = /ERROR: ([0-9]+):([0-9]+):/g

/**
 * Return a portion of the code that is two lines before the error and two lines after.
 */
function getCodeSection(code: string, errorMessage: string) {
    const lines = code.split(/\n\r?/)
    lines.unshift("")  // Because lines numbers start at 1
    RX_ERROR_MESSAGE.lastIndex = -1  // Reinit RegExp
    const matcher = RX_ERROR_MESSAGE.exec(errorMessage)
    if (!matcher) {
        return code
    }
    const SURROUNDING_LINES = 2
    const [, , lineNumberMatch] = matcher
    const lineNumber = Number(lineNumberMatch)
    const firstLine = Math.max(1, lineNumber - SURROUNDING_LINES)
    const lastLine = Math.min(lines.length - 1, lineNumber + SURROUNDING_LINES)
    const outputLines = ["Here is an extract of the shader code:"]
    for (let n = firstLine; n <= lastLine; n++) {
        outputLines.push(
            `| ${n}:    ${lines[n]}`
        )
    }
    return outputLines.join("\n")
}

/**
 * A shader can have dependencies.
 * The final shader code will be an aggregate of it's own code and of the
 * the code of all its dependencies.
 * Checks will be done to prevent declaration of same variables with
 * different types.
 */
function flattenShaderDependencies(
    shader: Shader,
    shadersAlreadyLoaded: Shader[] = []
): IFlattenedShader {
    try {
        const flattenedShader: IFlattenedShader = {
            attributes: { ...shader.attributesDefinition },
            functions: { ...shader.functionsDefinition },
            uniforms: { ...shader.uniformsDefinition },
            varyings: { ...shader.varyingsDefinition }
        }

        if (shadersAlreadyLoaded.length === 0 && typeof flattenedShader.functions.main === 'undefined') {
            throw Error("A shader must have a 'void main()' function!")
        }
        shadersAlreadyLoaded.push(shader)

        for (const depShader of shader.dependenciesDefinition) {
            // Skip already included shaders.
            if (shadersAlreadyLoaded.indexOf(depShader) !== -1) continue

            const depFlattenedShader: IFlattenedShader = {
                attributes: { ...depShader.attributesDefinition },
                functions: { ...depShader.functionsDefinition },
                uniforms: { ...depShader.uniformsDefinition },
                varyings: { ...depShader.varyingsDefinition }
            }
            // Remove potential main function because it has no sense for dependencies.
            delete depFlattenedShader.functions.main

            // Merge with current shader.
            mergeAttributes(flattenedShader.attributes, depFlattenedShader.attributes)
            mergeUniforms(flattenedShader.uniforms, depFlattenedShader.uniforms)
            mergeVaryings(flattenedShader.varyings, depFlattenedShader.varyings)
            mergeFunctions(flattenedShader.functions, depFlattenedShader.functions)
        }

        return flattenedShader
    } catch (ex) {
        throw Error(`Error in ${shader.constructor.name}:\n${ex}`)
    }
}

/**
 * We just ignore functions that have already been declared.
 * We don't check if the code is different.
 */
function mergeFunctions(oldFunctions: IFunctionTypes, newFunctions: IFunctionTypes) {
    for (const funName of Object.keys(newFunctions)) {
        const oldFun = oldFunctions[funName]
        const newFun = newFunctions[funName]
        if (!oldFun) {
            // Brand new attribute.
            oldFunctions[funName] = newFun
        }
    }
}

function mergeAttributes(oldAttribs: IAttributeTypes, newAttribs: IAttributeTypes) {
    for (const attName of Object.keys(newAttribs)) {
        const oldAtt = oldAttribs[attName]
        const newAtt = newAttribs[attName]
        if (!oldAtt) {
            // Brand new attribute.
            oldAttribs[attName] = newAtt
        } else {
            // This attributes already exists.
            // Check if the types are the same.
            if (oldAtt !== newAtt) {
                throw Error(`Attribute "${attName}" is redeclared in a dependency, but with a different type!`)
            }
        }
    }
}

function mergeUniforms(oldUniforms: IUniformTypes, newUniforms: IUniformTypes) {
    for (const uniName of Object.keys(newUniforms)) {
        const oldUni = oldUniforms[uniName]
        const newUni = newUniforms[uniName]
        if (!oldUni) {
            // Brand new uniform.
            oldUniforms[uniName] = newUni
        } else {
            // This attributes already exists.
            // Check if the types are the same.
            if (oldUni.type !== newUni.type) {
                throw Error(`Uniform "${uniName}" is redeclared in a dependency, but with a different type!`)
            }
            if ((oldUni.size || 1) !== (newUni.size || 1)) {
                throw Error(`Uniform "${uniName}[]" is redeclared in a dependency, but with a different number of items!`)
            }
        }
    }
}

function mergeVaryings(oldVarying: IVaryingTypes, newVarying: IVaryingTypes) {
    for (const varName of Object.keys(newVarying)) {
        const oldVar = oldVarying[varName]
        const newVar = newVarying[varName]
        if (!oldVar) {
            // Brand new varying.
            oldVarying[varName] = newVar
        } else {
            // This attributes already exists.
            // Check if the types are the same.
            if (oldVar.type !== newVar.type) {
                throw Error(`Varying "${varName}" is redeclared in a dependency, but with a different type!`)
            }
            if ((oldVar.size || 1) !== (newVar.size || 1)) {
                throw Error(`Varying "${varName}[]" is redeclared in a dependency, but with a different number of items!`)
            }
        }
    }
}

function writeLineNumbers(code: string) {
    const result: string[] = []
    const lines = code.split("\n")
    let lineNumber = 0
    for (const line of lines) {
        lineNumber++
        result.push(`${pad(lineNumber)} | ${line}`)
    }

    return result.join("\n")
}

function pad(num: number, len: number = 3) {
    let txt = `${num}`
    while (txt.length < len) txt = ` ${txt}`
    return txt
}

interface IFlattenedShader {
    attributes: IAttributeTypes
    functions: IFunctionTypes
    uniforms: IUniformTypes
    varyings: IVaryingTypes
}
