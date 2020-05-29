import Program from "../program"
import ShaderFactory from '../factory/shader'
import Shader from '../shader/abstract-shader'
import AbstractCamera from "./abstract-camera"
import Calc from "../calc"
import { IMat3, IMat4 } from '../types'

const HALF = 0.5
const HALF_PI = Math.PI * HALF
// Its PI/2 - Epsilon
const ALMOST_HALF_PI = 1.570796326794896

/**
 * Abstract camera for 3D space.
 */
export default abstract class Space3D extends AbstractCamera {
    protected readonly cameraMatrix: IMat4 = Calc.matrix.createMat4()
    private readonly rotationY = Calc.matrix.createMat4()
    private readonly rotationX = Calc.matrix.createMat4()
    private readonly transfo = Calc.matrix.createMat4()

    /**
     * The camera matrix holds all the transformations to get a point
     * from the world space into the camera space. This matrix is 4x4
     * and it allows translations.
     * This function will return a 3x3 matrix without the translations.
     * It can be useful for vectors instead of points.
     */
    extractCameraMatrix(mat3: IMat3) {
        Calc.matrix.extract3From4(this.cameraMatrix, mat3)
    }

    /**
     * The camera looks at (targetX, targetY, targetZ)
     * and it is at a distance of `distance`.
     * That defines a sphere. We use `latitude` and `longitude` to know
     * where the camera lies on the sphere.
     * For {dis: 1, lat: 0, lng: 0} the camera location will be (0,0,1).
     * For {dis: 1, lat: 0, lng: 90} the camera location will be (1,0,0).
     * Only the latitude will influence the Y coord.
     *
     * @param distance - Expressed in meters.
     * @param latitude - Expressed in radians.
     * @param longitude - Expressed in radians.
     */
    orbit(
        targetX: number, targetY: number, targetZ: number,
        distance: number, latitude: number, longitude: number
    ) {
        const { rotationY, rotationX, cameraMatrix } = this

        const lat = Calc.clamp(latitude, -ALMOST_HALF_PI, ALMOST_HALF_PI)
        const lng = longitude

        Calc.matrix.rotation4X(lat, rotationX)
        Calc.matrix.rotation4Y(-lng, rotationY)
        Calc.matrix.identity4(cameraMatrix)
        Calc.matrix.multiply4(rotationX, rotationY, cameraMatrix)

        const tX = targetX
        const tY = targetY
        const tZ = targetZ + distance

        cameraMatrix[Calc.M4_03] = -tX
        cameraMatrix[Calc.M4_13] = -tY
        cameraMatrix[Calc.M4_23] = -tZ
    }
}
