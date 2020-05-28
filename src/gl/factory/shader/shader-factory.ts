import AbstractShader from '../../shader/abstract-shader'
import {
    IAttributeType,
    IAttributeTypes,
    IVaryingType,
    IVaryingTypes,
    IUniformType,
    IUniformTypes,
    IFunctionTypes
} from '../../types'

export default {
    createVertShader: (def: Partial<IFriendlyVertexDefinition>) => new CustomShader(def),
    createFragShader: (def: Partial<IFriendlyFragmentDefinition>) => new CustomShader(def)
}


class CustomShader extends AbstractShader {
    private readonly definition: IDefinition

    constructor(def: Partial<IFriendlyDefinition>) {
        super()
        this.definition = {
            uniforms: convertFriendlyUniforms(def.uniforms),
            attributes: convertFriendlyAttributes(def.attributes),
            varyings: convertFriendlyVaryings(def.varyings),
            functions: def.functions || {},
            dependencies: def.dependencies || [],
        }
    }

    get uniformsDefinition() { return this.definition.uniforms }
    get attributesDefinition() { return this.definition.attributes }
    get varyingsDefinition() { return this.definition.varyings }
    get functionsDefinition() { return this.definition.functions }
    get dependenciesDefinition() { return this.definition.dependencies }
}


function convertFriendlyUniforms(uniforms?: IMap<IArray<IUniformStringType>>): IUniformTypes {
    if (!uniforms) return {}

    const result: IUniformTypes = {}
    for (const key of Object.keys(uniforms)) {
        result[key] = convertFriendlyUniform(uniforms[key])
    }
    return result
}

function convertFriendlyUniform(uniform: IArray<IUniformStringType>): { type: IUniformType, size: number } {
    if (!Array.isArray(uniform)) return convertFriendlyUniform([uniform, 1])

    const [stringType, size] = uniform
    switch (stringType) {
        case "vec2": return { type: IUniformType.FLOAT_VEC2, size }
        case "vec3": return { type: IUniformType.FLOAT_VEC3, size }
        case "vec4": return { type: IUniformType.FLOAT_VEC4, size }
        case "mat2": return { type: IUniformType.FLOAT_MAT2, size }
        case "mat3": return { type: IUniformType.FLOAT_MAT3, size }
        case "mat4": return { type: IUniformType.FLOAT_MAT4, size }
        case "sampler2D": return { type: IUniformType.SAMPLER_2D, size }
        case "samplerCube": return { type: IUniformType.SAMPLER_CUBE, size }
        default: return { type: IUniformType.FLOAT, size }
    }
}


function convertFriendlyAttributes(attributes?: IMap<IAttributeStringType>): IAttributeTypes {
    if (!attributes) return {}

    const result: IAttributeTypes = {}
    for (const key of Object.keys(attributes)) {
        result[key] = convertFriendlyAttribute(attributes[key])
    }
    return result
}

function convertFriendlyAttribute(attribute: IArray<IAttributeStringType>): IAttributeType {
    switch (attribute) {
        case "vec2": return IAttributeType.FLOAT_VEC2
        case "vec3": return IAttributeType.FLOAT_VEC3
        case "vec4": return IAttributeType.FLOAT_VEC4
        default: return IAttributeType.FLOAT
    }
}


function convertFriendlyVaryings(varyings?: IMap<IArray<IVaryingStringType>>): IVaryingTypes {
    if (!varyings) return {}

    const result: IVaryingTypes = {}
    for (const key of Object.keys(varyings)) {
        result[key] = convertFriendlyVarying(varyings[key])
    }
    return result
}

function convertFriendlyVarying(varying: IArray<IVaryingStringType>): { type: IVaryingType, size: number } {
    if (!Array.isArray(varying)) return convertFriendlyVarying([varying, 1])

    const [stringType, size] = varying
    switch (stringType) {
        case "vec2": return { type: IVaryingType.FLOAT_VEC2, size }
        case "vec3": return { type: IVaryingType.FLOAT_VEC3, size }
        case "vec4": return { type: IVaryingType.FLOAT_VEC4, size }
        case "mat2": return { type: IVaryingType.FLOAT_MAT2, size }
        case "mat3": return { type: IVaryingType.FLOAT_MAT3, size }
        case "mat4": return { type: IVaryingType.FLOAT_MAT4, size }
        default: return { type: IVaryingType.FLOAT, size }
    }
}


interface IDefinition {
    uniforms: IUniformTypes
    attributes: IAttributeTypes
    varyings: IVaryingTypes
    functions: IFunctionTypes
    dependencies: AbstractShader[]
}

interface IMap<T> { [key: string]: T }
type IArray<T> = T | [T, number]

type IUniformStringType =
    "float" | "vec2" | "vec3" | "vec4" | "mat2" | "mat3" | "mat4" | "sampler2D" | "samplerCube"
type IAttributeStringType =
    "float" | "vec2" | "vec3" | "vec4"
type IVaryingStringType =
    "float" | "vec2" | "vec3" | "vec4" | "mat2" | "mat3" | "mat4"

interface IFriendlyFragmentDefinition {
    uniforms: IMap<IArray<IUniformStringType>>
    functions: IFunctionTypes
    dependencies: AbstractShader[]
}

interface IFriendlyVertexDefinition extends IFriendlyFragmentDefinition {
    attributes: IMap<IAttributeStringType>
    varyings: IMap<IArray<IVaryingStringType>>
}

type IFriendlyDefinition = IFriendlyVertexDefinition
