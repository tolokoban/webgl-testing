import Space3D from "../space-3d"
import Program from "../../program"
import ShaderFactory from '../../factory/shader'
import PerspectiveVertexShaderCode from "./perspective.world-point-to-screen.vert"
import Calc from "../../calc"

const HALF_TURN_DEG = 180
const DEFAULT_FIELD_ANGLE_DEG = 10
const DEFAULT_FIELD_ANGLE_RAD = DEFAULT_FIELD_ANGLE_DEG * Math.PI / HALF_TURN_DEG
const MAT4_LENGTH = 16
const HALF = 0.5
const DOUBLE = 2

const VERTEX_SHADER = ShaderFactory.createVertShader({
    uniforms: {
        uniPerspectiveMatrix: "mat4",
        uniCameraMatrix: "mat4"
    },
    functions: {
        worldPointToScreen: PerspectiveVertexShaderCode
    }
})

export default class Perspective extends Space3D {
    private perspectiveMatrix = new Float32Array(MAT4_LENGTH)

    /**
     * Field view angle expressed in radians.
     */
    fieldAngle = DEFAULT_FIELD_ANGLE_RAD
    near = 0.1
    far = 1000

    static VertexShader = VERTEX_SHADER

    constructor() {
        super()
        const distance = 15
        this.orbit(0, 0, 0, distance, 0, 0)
    }

    get vertexShader() { return Perspective.VertexShader }

    /**
     * @param prg - Attributes have to be set in this Program.
     * @param width - Canvas Width.
     * @param height - Canvas Height.
     * @param time - Time of the rendered frame in milliseconds.
     */
    setUniformValues(prg: Program, width: number, height: number) {
        const { near, far, fieldAngle } = this
        const f = Math.tan(HALF * (Math.PI - fieldAngle))
        const rangeInv = 1 / (near - far)

        const result = this.perspectiveMatrix
        result[Calc.M4_00] = f * height / width
        result[Calc.M4_10] = 0
        result[Calc.M4_20] = 0
        result[Calc.M4_30] = 0

        result[Calc.M4_01] = 0
        result[Calc.M4_11] = f
        result[Calc.M4_21] = 0
        result[Calc.M4_31] = 0

        result[Calc.M4_02] = 0
        result[Calc.M4_12] = 0
        result[Calc.M4_22] = (near + far) * rangeInv
        result[Calc.M4_32] = -1

        result[Calc.M4_03] = 0
        result[Calc.M4_13] = 0
        result[Calc.M4_23] = near * far * rangeInv * DOUBLE
        result[Calc.M4_33] = 0

        prg.use()
        prg.uniforms.set("uniCameraMatrix", this.cameraMatrix)
        prg.uniforms.set("uniPerspectiveMatrix", this.perspectiveMatrix)
    }
}
