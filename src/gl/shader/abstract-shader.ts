import {
    IFunctionTypes,
    IAttributeTypes,
    IVaryingTypes,
    IUniformType, IUniformTypes,
    IUniformSetter,
    IWebGL
} from '../types'

export default abstract class AbstractShader {
    abstract get uniformsDefinition(): IUniformTypes
    abstract get attributesDefinition(): IAttributeTypes
    abstract get varyingsDefinition(): IVaryingTypes
    abstract get functionsDefinition(): IFunctionTypes
    abstract get dependenciesDefinition(): AbstractShader[]
}
