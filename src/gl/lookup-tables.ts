import {
    IWebGL,
    IAttributeType,
    IVaryingType,
    IUniformType
} from './types'

export default {
    getAttributeSize,
    getAttributeTypeCodeName,
    getUniformTypeCodeName,
    getVaryingTypeCodeName,
    getWebGLTypeFromAttributeType
}

function getWebGLTypeFromAttributeType(gl: IWebGL, type: IAttributeType): number {
    switch (type) {
        case IAttributeType.FLOAT_VEC2: return gl.FLOAT_VEC2
        case IAttributeType.FLOAT_VEC3: return gl.FLOAT_VEC3
        case IAttributeType.FLOAT_VEC4: return gl.FLOAT_VEC4
        default: return gl.FLOAT
    }
}

function getAttributeTypeCodeName(type: IAttributeType): string | undefined {
    return mapEnumAttributeTypeToStringType.get(type)
}

function getUniformTypeCodeName(type: IUniformType): string | undefined {
    return mapEnumUniformTypeToStringType.get(type)
}

function getVaryingTypeCodeName(type: IVaryingType): string | undefined {
    return mapEnumVaryingTypeToStringType.get(type)
}

function getAttributeSize(type: IAttributeType): number {
    switch (type) {
        case IAttributeType.FLOAT_VEC2: return 2
        case IAttributeType.FLOAT_VEC3: return 3
        case IAttributeType.FLOAT_VEC4: return 4
        default: return 1
    }
}


const mapEnumAttributeTypeToStringType = new Map<IAttributeType, string>()

mapEnumAttributeTypeToStringType.set(IAttributeType.FLOAT, "float")
mapEnumAttributeTypeToStringType.set(IAttributeType.FLOAT_VEC2, "vec2")
mapEnumAttributeTypeToStringType.set(IAttributeType.FLOAT_VEC3, "vec3")
mapEnumAttributeTypeToStringType.set(IAttributeType.FLOAT_VEC4, "vec4")

const mapEnumVaryingTypeToStringType = new Map<IVaryingType, string>()

mapEnumVaryingTypeToStringType.set(IVaryingType.FLOAT, "float")
mapEnumVaryingTypeToStringType.set(IVaryingType.FLOAT_VEC2, "vec2")
mapEnumVaryingTypeToStringType.set(IVaryingType.FLOAT_VEC3, "vec3")
mapEnumVaryingTypeToStringType.set(IVaryingType.FLOAT_VEC4, "vec4")
mapEnumVaryingTypeToStringType.set(IVaryingType.FLOAT_MAT2, "mat2")
mapEnumVaryingTypeToStringType.set(IVaryingType.FLOAT_MAT3, "mat3")
mapEnumVaryingTypeToStringType.set(IVaryingType.FLOAT_MAT4, "mat4")

const mapEnumUniformTypeToStringType = new Map<IUniformType, string>()

mapEnumUniformTypeToStringType.set(IUniformType.BOOL, "bool")
mapEnumUniformTypeToStringType.set(IUniformType.BYTE, "int")
mapEnumUniformTypeToStringType.set(IUniformType.SHORT, "int")
mapEnumUniformTypeToStringType.set(IUniformType.INT, "int")
mapEnumUniformTypeToStringType.set(IUniformType.UNSIGNED_BYTE, "uint")
mapEnumUniformTypeToStringType.set(IUniformType.UNSIGNED_SHORT, "uint")
mapEnumUniformTypeToStringType.set(IUniformType.UNSIGNED_INT, "uint")
mapEnumUniformTypeToStringType.set(IUniformType.SAMPLER_2D, "sampler2D")
mapEnumUniformTypeToStringType.set(IUniformType.SAMPLER_CUBE, "samplerCube")
mapEnumUniformTypeToStringType.set(IUniformType.FLOAT, "float")
mapEnumUniformTypeToStringType.set(IUniformType.FLOAT_VEC2, "vec2")
mapEnumUniformTypeToStringType.set(IUniformType.FLOAT_VEC3, "vec3")
mapEnumUniformTypeToStringType.set(IUniformType.FLOAT_VEC4, "vec4")
mapEnumUniformTypeToStringType.set(IUniformType.FLOAT_MAT2, "mat2")
mapEnumUniformTypeToStringType.set(IUniformType.FLOAT_MAT3, "mat3")
mapEnumUniformTypeToStringType.set(IUniformType.FLOAT_MAT4, "mat4")
