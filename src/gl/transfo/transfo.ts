import Calc from '../calc'
import { IMat4 } from '../types'

export default abstract class Transfo {
    public parent?: Transfo
    protected transfo: IMat4 = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
    private composedTransfo: IMat4 = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])
    protected abstract compute(): IMat4

    get value(): IMat4 {
        const value = this.compute()
        const { parent } = this
        if (!parent) return value
        Calc.matrix.multiply4(parent.transfo, value, this.composedTransfo)
        return this.composedTransfo
    }
}
