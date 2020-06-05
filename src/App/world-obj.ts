import Scene from '../gl/scene'
import MeshFactory from '../gl/factory/mesh'
import Mesh from '../gl/mesh'
import OutlineMesh from '../gl/mesh/outline'


const PALETTE = "./assets/palette/default-64.png"

export default {
    async createAsync(scene: Scene, url: string): Promise<WorldObj> {
        const body = await MeshFactory.Fresnel.createAsync({
            colorTextureURL: PALETTE,
            definitionURL: url,
            scene
        })
        const outline = await MeshFactory.Outline.createAsync({
            definitionURL: url,
            scene
        })
        return new WorldObj(body, outline)
    }
}


class WorldObj {
    constructor(private body: Mesh, private outline: OutlineMesh) { }

    get color() { return this.outline.color }
    get thickness() { return this.outline.thickness }
    set thickness(v: number) { this.outline.thickness = v }

    get x() { return this.body.x }
    set x(v: number) {
        this.body.x = v
        this.outline.x = v
    }
    get y() { return this.body.y }
    set y(v: number) {
        this.body.y = v
        this.outline.y = v
    }
    get z() { return this.body.z }
    set z(v: number) {
        this.body.z = v
        this.outline.z = v
    }

    paint(time: number) {
        this.outline.paint(time)
        this.body.paint(time)
    }
}
