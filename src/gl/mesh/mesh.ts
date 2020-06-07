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
    public readonly transfo: Transfo

    constructor(transfo: Transfo) {
        this.transfo = transfo
    }

    abstract get program(): Program

    /**
     * Paint the mesh on a scene.
     */
    abstract paint(time: number): void

    /**
     * Clean up.
     */
    abstract destroy(): void
}
