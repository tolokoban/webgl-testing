import Calc from '../calc'
import Transfo from './transfo'

export default class PolarLocSca extends Transfo {
    private _x = 0
    private _y = 0
    private _z = 0
    private _sx = 1
    private _sy = 1
    private _sz = 1
    private _lat = 0
    private _lng = 0
    private _dirty = true

    get x() { return this._x }
    set x(v: number) {
        this._x = v
        this._dirty = true
    }
    get y() { return this._y }
    set y(v: number) {
        this._y = v
        this._dirty = true
    }
    get z() { return this._z }
    set z(v: number) {
        this._z = v
        this._dirty = true
    }
    get sx() { return this._sx }
    set sx(v: number) {
        this._sx = v
        this._dirty = true
    }
    get sy() { return this._sy }
    set sy(v: number) {
        this._sy = v
        this._dirty = true
    }
    get sz() { return this._sz }
    set sz(v: number) {
        this._sz = v
        this._dirty = true
    }
    /**
     * Latitude in degres.
     */
    get lat() { return this._lat }
    /**
     * Latitude in degres.
     */
    set lat(v: number) {
        this._lat = v
        this._dirty = true
    }
    /**
     * Longitude in degres.
     */
    get lng() { return this._lng }
    /**
     * Longitude in degres.
     */
    set lng(v: number) {
        this._lng = v
        this._dirty = true
    }

    protected compute() {
        if (!this._dirty) return this.transfo

        const { x, y, z, sx, sy, sz, lat, lng, transfo } = this
        const latRad = Calc.deg2rad(lat)
        const lngRad = Calc.deg2rad(lng)
        const cosX = Math.cos(latRad)
        const sinX = Math.sin(latRad)
        const cosY = Math.cos(lngRad)
        const sinY = Math.sin(lngRad)

        transfo[Calc.M4_00] = sx * cosY
        transfo[Calc.M4_10] = 0
        transfo[Calc.M4_20] = -sx * sinY
        transfo[Calc.M4_30] = 0
        transfo[Calc.M4_01] = sy * sinX * sinY
        transfo[Calc.M4_11] = sy * cosX
        transfo[Calc.M4_21] = sy * sinX * cosY
        transfo[Calc.M4_31] = 0
        transfo[Calc.M4_02] = sz * cosX * sinY
        transfo[Calc.M4_12] = -sz * sinX
        transfo[Calc.M4_22] = sz * cosX * cosY
        transfo[Calc.M4_32] = 0
        transfo[Calc.M4_03] = x
        transfo[Calc.M4_13] = y
        transfo[Calc.M4_23] = z
        transfo[Calc.M4_33] = 1

        this._dirty = false
        return transfo
    }
}
