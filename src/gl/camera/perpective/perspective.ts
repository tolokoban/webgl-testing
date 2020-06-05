import Space3D from "../space-3d"
import Program from "../../program"
import PointVertexShaderCode from "./perspective.world-point-to-screen.vert"
import VectorVertexShaderCode from "./perspective.world-vector-to-screen.vert"
import Calc from "../../calc"
import { IFriendlyVertexDefinition } from '../../types'

const HALF_TURN_DEG = 180
const DEFAULT_FIELD_ANGLE_DEG = 39.6
const DEFAULT_FIELD_ANGLE_RAD = DEFAULT_FIELD_ANGLE_DEG * Math.PI / HALF_TURN_DEG
const HALF = 0.5
const DOUBLE = 2


export default class Perspective extends Space3D {
    private perspectiveMatrix = Calc.matrix.createMat4()
    private cameraMatrix3 = Calc.matrix.createMat3()

    /**
     * Field view angle expressed in radians.
     */
    fieldAngle = DEFAULT_FIELD_ANGLE_RAD
    near = 0.1
    far = 1000

    constructor() {
        super()
        const distance = 15
        this.orbit(0, 0, 0, distance, 0, 0)
    }

    get id() { return "[CAMERA/PERSPECTIVE]" }

    get vertexShader(): Partial<IFriendlyVertexDefinition> {
        return {
            uniforms: {
                uniPerspectiveMatrix: "mat4",
                uniCameraMatrix: "mat4",
                uniCameraMatrix3: "mat3"
            },
            functions: {
                worldPointToScreen: PointVertexShaderCode,
                worldVectorToScreen: VectorVertexShaderCode
            }
        }
    }

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

        // Used to rotate normals without translating them.
        Calc.matrix.extract3From4(this.cameraMatrix, this.cameraMatrix3)

        prg.use()
        prg.uniforms.set("uniCameraMatrix", this.cameraMatrix)
        prg.uniforms.set("uniCameraMatrix3", this.cameraMatrix3)
        prg.uniforms.set("uniPerspectiveMatrix", this.perspectiveMatrix)
    }
}
