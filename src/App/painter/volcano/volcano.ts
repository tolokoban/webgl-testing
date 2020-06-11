import Scene from '../../../gl/scene'
import Painter from '../painter'
import WorldObj from '../../world-obj'
import WorldObjFactory from '../../world-obj-factory'
import Smoke from './smoke'
import SmokeFactory from './smoke/smoke-factory'

export default class VolcanoIsland extends Painter {
    static async createAsync(scene: Scene): Promise<VolcanoIsland> {
        const mainObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Island-A.json'
        )
        const smoke = await SmokeFactory.createAsync(scene)
        return new VolcanoIsland(mainObject, smoke)
    }

    private constructor(private mainObject: WorldObj, private smoke: Smoke) {
        super()
        smoke.transfo.parent = mainObject.transfo
    }

    get transfo() { return this.mainObject.transfo }

    paint(time: number) {
        this.mainObject.paint(time)
        this.smoke.paint(time)
    }
}
