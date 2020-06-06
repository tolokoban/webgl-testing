import Calc from '../calc'
import Transfo from './transfo'

export default class PolarLocSca extends Transfo {
    public x = 0
    public y = 0
    public z = 0
    public sx = 1
    public sy = 1
    public sz = 1
    public lat = 0
    public lng = 0

    get value() {
        const { x, y, z, sx, sy, sz, transfo } = this
        transfo[Calc.M4_00] = sx
        transfo[Calc.M4_10] = 0
        transfo[Calc.M4_20] = 0
        transfo[Calc.M4_30] = 0
        transfo[Calc.M4_01] = 0
        transfo[Calc.M4_11] = sy
        transfo[Calc.M4_21] = 0
        transfo[Calc.M4_31] = 0
        transfo[Calc.M4_02] = 0
        transfo[Calc.M4_12] = 0
        transfo[Calc.M4_22] = sz
        transfo[Calc.M4_32] = 0
        transfo[Calc.M4_03] = x
        transfo[Calc.M4_13] = y
        transfo[Calc.M4_23] = z
        transfo[Calc.M4_33] = 1

        return transfo
    }
}
