import Mesh from '../gl/mesh'
import OutlineMesh from '../gl/mesh/outline'
import PolarLocSca from '../gl/transfo/polar-loc-sca'

export default class WorldObj {
    public readonly transfo: PolarLocSca

    constructor(private body: Mesh, private outline: OutlineMesh) {
        const { transfo } = this.body
        if (transfo instanceof PolarLocSca) {
            this.transfo = transfo
        } else {
            throw Error("Expected a PolarLocSca transfo!")
        }
    }

    get color() { return this.outline.color }
    get thickness() { return this.outline.thickness }
    set thickness(v: number) { this.outline.thickness = v }

    paint(time: number) {
        this.outline.paint(time)
        this.body.paint(time)
    }
}
