import Scene from '../../gl/scene'
import Painter from './painter'
import WorldObj from '../world-obj'
import WorldObjFactory from '../world-obj-factory'

export default class Hydre extends Painter {
    static async createAsync(scene: Scene): Promise<Hydre> {
        const mainObject = await WorldObjFactory.createAsync(
            scene, './assets/mesh/Hydre.json'
        )
        return new Hydre(mainObject)
    }

    private constructor(private mainObject: WorldObj) {
        super()
    }

    get transfo() { return this.mainObject.transfo }

    paint(time: number) {
        this.mainObject.paint(time)
    }
}
