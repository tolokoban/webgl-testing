import Calc from '../calc'
import Transfo from './transfo'

export default class StaticTransfo extends Transfo {
    private _transfo = Calc.matrix.createMat4()

    constructor(
        x: number = 0, y: number = 0, z: number = 0,
        sx: number = 1, sy: number = 0, sz: number = 0
    ) {
        super()
        const t = this._transfo
        t[Calc.M4_00] = sx
        t[Calc.M4_11] = sy || sx
        t[Calc.M4_22] = sz || sx
        t[Calc.M4_33] = 1
        t[Calc.M4_03] = x
        t[Calc.M4_13] = y
        t[Calc.M4_23] = z
    }

    protected compute() { return this._transfo }
}
