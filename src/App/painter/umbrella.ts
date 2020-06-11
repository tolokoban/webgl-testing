import Scene from '../../gl/scene'
import Painter from './painter'
import WorldObj from '../world-obj'
import WorldObjFactory from '../world-obj-factory'

export default class Umbrella extends Painter {
    static async createAsync(scene: Scene): Promise<Umbrella> {
        const mainObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Umbrella.json'
        )
        return new Umbrella(mainObject)
    }

    private constructor(private mainObject: WorldObj) {
        super()
    }

    get transfo() { return this.mainObject.transfo }

    paint(time: number) {
        this.mainObject.paint(time)
    }
}
