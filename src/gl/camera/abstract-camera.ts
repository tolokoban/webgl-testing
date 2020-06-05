import Program from "../program"
import { IFriendlyVertexDefinition } from '../types'

/**
 * The Camera is responsible of transforming World coordinates into
 * Screen coordinates.
 * To do this, the Camera defines the following Vertex Shader function:
 *
 * ```glsl
 * vec4 worldPointToScreen(vec3 point)
 * vec3 worldVectorToScreen(vec3 vector)
 * ```
 *
 * And it can work only if the following attributes are defined:
 *
 * ```glsl
 * attribute float uniCanvasWidth;
 * attribute float uniCanvasHeight;
 * ```
 *
 * Because there is a lot of different cameras, they can need extra attributes.
 * That's why Camera provides two readonly properties:
 * * `glslUniforms`:
 * * `glslFunction`
 */
export default abstract class AbstractCamera {
    abstract get id(): string

    abstract get vertexShader(): Partial<IFriendlyVertexDefinition>

    /**
     * @param prg - Attributes have to be set in this Program.
     * @param width - Canvas Width.
     * @param height - Canvas Height.
     * @param time - Time of the rendered frame in milliseconds.
     */
    abstract setUniformValues(
        prg: Program,
        width: number,
        height: number,
        time: number
    ): void
}
