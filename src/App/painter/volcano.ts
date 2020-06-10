import Scene from '../../gl/scene'
import Painter from './painter'
import WorldObj from '../world-obj'
import WorldObjFactory from '../world-obj-factory'

export default {
    async createAsync(scene: Scene): Promise<VolcanoIsland> {
        const mainObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Island-A.json'
        )
        return new VolcanoIsland(mainObject)
    }
}

class VolcanoIsland extends Painter {
    constructor(private mainObject: WorldObj) {
        super()
    }

    get transfo() { return this.mainObject.transfo }

    paint(time: number) {
        this.mainObject.paint(time)
    }
}
