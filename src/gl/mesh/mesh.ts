import Calc from '../calc'
import Program from '../program'
import { IVec3 } from '../types'

const X = 0
const Y = 1
const Z = 2
const UP: IVec3 = new Float32Array([0, 1, 0])

export default abstract class Mesh {
    protected location: IVec3 = new Float32Array([0, 0, 0])
    protected transfo = Calc.matrix.createMat4()

    constructor() {
        Calc.matrix.identity4(this.transfo)
    }

    abstract get program(): Program

    get x() { return this.location[X] }
    set x(value: number) {
        this.location[X] = value
        this.transfo[Calc.M4_03] = value
    }
    get y() { return this.location[Y] }
    set y(value: number) {
        this.location[Y] = value
        this.transfo[Calc.M4_13] = value
    }
    get z() { return this.location[Z] }
    set z(value: number) {
        this.location[Z] = value
        this.transfo[Calc.M4_23] = value
    }

    lookAt(target: IVec3, up: IVec3 = UP) {
        Calc.matrix.lookAt4(
            this.location,
            target,
            up,
            this.transfo
        )
    }

    /**
     * Paint the mesh on a scene.
     */
    abstract paint(time: number): void

    /**
     * Clean up.
     */
    abstract destroy(): void
}
