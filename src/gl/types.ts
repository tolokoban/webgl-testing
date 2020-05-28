export enum IAttributeType {
    //INT, BYTE, SHORT, UNSIGNED_INT, UNSIGNED_BYTE, UNSIGNED_SHORT,
    FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4
}

export enum IUniformType {
    FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4,
    BYTE, UNSIGNED_BYTE, SHORT, UNSIGNED_SHORT, INT, UNSIGNED_INT,
    BOOL,
    SAMPLER_2D, SAMPLER_CUBE
}

export enum IVaryingType {
    FLOAT, FLOAT_VEC2, FLOAT_VEC3, FLOAT_VEC4, FLOAT_MAT2, FLOAT_MAT3, FLOAT_MAT4
}

export interface IAttributeTypes { [key: string]: IAttributeType }

export interface IFunctionTypes { [key: string]: string | string[] }

export interface IUniformTypes {
    [key: string]: {
        type: IUniformType,
        size?: number
    }
}

export interface IVaryingTypes {
    [key: string]: {
        type: IVaryingType,
        size?: number
    }
}

export type IUniformSetterNumber = (value: number) => void
export type IUniformSetterFloat32Array = (value: Float32Array) => void
export type IUniformSetterInt32Array = (value: Int32Array) => void
export type IUniformSetter = IUniformSetterNumber | IUniformSetterFloat32Array | IUniformSetterInt32Array

export type IWebGL = WebGLRenderingContext | WebGL2RenderingContext

export type IVec3 = Float32Array
export type IVec4 = Float32Array
export type IMat3 = Float32Array
export type IMat4 = Float32Array
