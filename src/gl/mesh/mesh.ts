import Calc from '../calc'
import Program from '../program'
import Transfo from '../transfo'
import { IVec3 } from '../types'

const X = 0
const Y = 1
const Z = 2
const UP: IVec3 = new Float32Array([0, 1, 0])

export default abstract class Mesh {
    protected location: IVec3 = Calc.vector.createVec3()
    private target: IVec3 = Calc.vector.createVec3()
    public readonly transfo
    private _scaleX = 1
    private _scaleY = 1
    private _scaleZ = 1

    constructor(transfo: Transfo) {
        this.transfo = transfo
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

    get scaleX() { return this._scaleX }
    set scaleX(v: number) {
        if (v === 0) return
        this.transfo[Calc.M4_00] *= v / this.scaleX
        this._scaleX = v
    }
    get scaleY() { return this._scaleY }
    set scaleY(v: number) {
        if (v === 0) return
        this.transfo[Calc.M4_11] *= v / this.scaleY
        this._scaleY = v
    }
    get scaleZ() { return this._scaleZ }
    set scaleZ(v: number) {
        if (v === 0) return
        this.transfo[Calc.M4_22] *= v / this.scaleZ
        this._scaleZ = v
    }

    lookAt(target: IVec3, up: IVec3 = UP) {
        Calc.matrix.lookAt4(
            this.location,
            target,
            up,
            this.transfo
        )
    }

    setPolarOrientation(latitude: number, longitude: number) {
        const { transfo, location } = this
        Calc.matrix.identity4(transfo)
        Calc.matrix.rotation4Y(longitude, transfo)
        tr
        const r = Math.cos(latitude)
        target[X] = -r * Math.sin(longitude) + location[X]
        target[Y] = Math.sin(latitude) + location[Y]
        target[Z] = -r * Math.cos(longitude) + location[Z]
        this.lookAt(target)
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
