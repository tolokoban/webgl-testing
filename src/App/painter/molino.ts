import Scene from '../../gl/scene'
import Painter from './painter'
import WorldObj from '../world-obj'
import WorldObjFactory from '../world-obj-factory'

export default {
    async createAsync(scene: Scene): Promise<MolinoIsland> {
        const mainObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Island-B.json'
        )
        const helixObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Helix.json'
        )
        return new MolinoIsland(mainObject, helixObject)
    }
}

class MolinoIsland extends Painter {
    constructor(private mainObject: WorldObj, private helixObject: WorldObj) {
        super()
        helixObject.transfo.parent = mainObject.transfo
        helixObject.transfo.y = 10
        const scale = 6
        helixObject.transfo.sx = scale
        helixObject.transfo.sy = scale
        helixObject.transfo.sz = scale
    }

    get transfo() { return this.mainObject.transfo }

    paint(time: number) {
        this.helixObject.transfo.lng = -time * 0.1

        this.mainObject.paint(time)
        this.helixObject.paint(time)
    }
}
