import Scene from '../../gl/scene'
import Painter from './painter'
import WorldObj from '../world-obj'
import WorldObjFactory from '../world-obj-factory'

export default {
    async createAsync(scene: Scene): Promise<Balzac> {
        const mainObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Balzac.json'
        )
        return new Balzac(mainObject)
    }
}

class Balzac extends Painter {
    constructor(private mainObject: WorldObj) {
        super()
    }

    get transfo() { return this.mainObject.transfo }

    paint(time: number) {
        this.mainObject.paint(time)
    }
}
