import { IMat4 } from '../types'

export default abstract class Transfo {
    protected transfo: IMat4 = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
    abstract get value(): IMat4
}
