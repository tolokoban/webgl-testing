import Scene from '../gl/scene'
import MeshFactory from '../gl/factory/mesh'
import Mesh from '../gl/mesh'
import OutlineMesh from '../gl/mesh/outline'
import PolarLocSca from '../gl/transfo/polar-loc-sca'
import WorldObj from './world-obj'

const PALETTE = "./assets/palette/default-64.png"

export default {
    async createAsync(scene: Scene, url: string): Promise<WorldObj> {
        const transfo = new PolarLocSca()
        const body = await MeshFactory.Fresnel.createAsync(
            transfo, {
                colorTextureURL: PALETTE,
                definitionURL: url,
                scene
            }
        )
        const outline = await MeshFactory.Outline.createAsync({
            transfo,
            definitionURL: url,
            scene
        })
        return new WorldObj(body, outline)
    }
}
