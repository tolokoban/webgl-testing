import Scene from '../../../gl/scene'
import Painter from '../painter'
import WorldObj from '../../world-obj'
import WorldObjFactory from '../../world-obj-factory'
import Rain from './rain'
import RainFactory from './rain/rain-factory'

export default {
    async createAsync(scene: Scene): Promise<StoneIsland> {
        const mainObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Stone.json'
        )
        const helixObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Helix.json'
        )
        const rain = await RainFactory.createAsync(scene)
        return new StoneIsland(mainObject, helixObject, rain)
    }
}


class StoneIsland extends Painter {
    constructor(
        private mainObject: WorldObj,
        private helixObject: WorldObj,
        private rain: Rain
    ) {
        super()
        helixObject.transfo.parent = mainObject.transfo
        const scale = 3
        helixObject.transfo.sx = scale
        helixObject.transfo.sy = scale
        helixObject.transfo.sz = scale
        helixObject.transfo.y = -1

    }

    get transfo() { return this.mainObject.transfo }

    paint(time: number) {
        this.helixObject.transfo.lng = -time * 0.2

        this.rain.paint(time)
        this.mainObject.paint(time)
        this.helixObject.paint(time)
    }
}
