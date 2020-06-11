import Calc from '../../gl/calc'
import Scene from '../../gl/scene'
import PerspectiveCamera from '../../gl/camera/perpective'

import { IObjects } from '../types'

const TYSON_ID = 0
const HYDRE_ID = 1
const BALZAC_ID = 2
const GOLGOTH_ID = 3
const TYSON_SPEED = 1
const HYDRE_SPEED = 2
const BALZAC_SPEED = 5
const GOLGOTH_SPEED = 10
const SPEEDS = [TYSON_SPEED, HYDRE_SPEED, BALZAC_SPEED, GOLGOTH_SPEED]

interface IGameStep {
    sides: [number, number, number, number]
    timeUsed: number
}

const AVAILABLE_TIME = 17
const MS_TO_SEC = 0.001
const ISLANDS_GAP = 5

export default class GameManager {
    private animating = false
    private currentTime = 0
    private beginTime = 0
    private endTime = 0
    private jumpers: [boolean, boolean, boolean, boolean] = [false, false, false, false]
    private steps: IGameStep[] = []

    constructor() {
        this.steps.push({
            sides: [-1, -1, -1, -1],
            timeUsed: 0
        })
    }

    get remainingTime() {
        let remainingTime = AVAILABLE_TIME
        for (const step of this.steps) {
            remainingTime -= step.timeUsed
        }
        if (this.animating) {
            remainingTime -= (this.currentTime - this.beginTime) * MS_TO_SEC
        }
        return remainingTime
    }

    /**
     * -1 is left
     *  0 is center
     * +1 is right
     */
    get alpha() {
        const TWO = 2
        const { currentTime, beginTime, endTime } = this
        const alphaTime = Calc.clamp(
            (currentTime - beginTime) / (endTime - beginTime), 0, 1
        )
        if ((this.steps.length & 1) === 1) {
            // From left.
            if (this.animating) {
                return TWO * alphaTime - 1
            }
            return -1
        }
        // From right.
        if (this.animating) {
            return 1 - TWO * alphaTime
        }
        return +1
    }

    play(time: number, objects: IObjects, camera: PerspectiveCamera) {
        this.currentTime = time
        locateIslands(time, objects)
        locateUmbrella(time, objects, this.alpha)
        this.locateHeroes(time, objects)

        camera.orbit(
            0, 3, 0,
            20, Calc.deg2rad(30), Calc.deg2rad(50 * Math.cos(time * 0.00023))
        )
    }

    private locateHeroes(time: number, objects: IObjects) {
        this.locateTyson(time, objects)
        this.locateHydre(time, objects)
        this.locateBalzac(time, objects)
        this.locateGolgoth(time, objects)
    }

    private locateTyson(time: number, objects: IObjects) {
        const tyson = objects.tyson.transfo
        tyson.x = this.alpha * ISLANDS_GAP
        tyson.y = getIslandsInfluence(this.alpha, objects)
        tyson.z = 1
    }

    private locateHydre(time: number, objects: IObjects) {
        const hydre = objects.hydre.transfo
        hydre.x = this.alpha * (ISLANDS_GAP + 2)
        hydre.y = getIslandsInfluence(this.alpha, objects) + 0.9
        hydre.z = 1
    }

    private locateBalzac(time: number, objects: IObjects) {
        const balzac = objects.balzac.transfo
        balzac.x = this.alpha * (ISLANDS_GAP + 2)
        balzac.y = getIslandsInfluence(this.alpha, objects)
        balzac.z = -1
    }

    private locateGolgoth(time: number, objects: IObjects) {
        const golgoth = objects.golgoth.transfo
        golgoth.x = this.alpha * ISLANDS_GAP
        golgoth.y = getIslandsInfluence(this.alpha, objects)
        golgoth.z = -1
    }
}


function locateUmbrella(time: number, objects: IObjects, alpha: number) {
    const t = objects.umbrella.transfo
    t.y = 6.5 + Math.cos(time * 0.000457) * 0.3
        + getIslandsInfluence(alpha, objects)
    t.x = ISLANDS_GAP * alpha
    t.lng = time * 0.09
}

function locateIslands(time: number, objects: IObjects) {
    objects.volcano.transfo.x = -ISLANDS_GAP - 5
    objects.molino.transfo.x = +ISLANDS_GAP + 11

    objects.volcano.transfo.y = Math.cos(time * 0.001878)
    objects.molino.transfo.y = Math.cos(time * 0.001001)
    objects.stone.transfo.y = Math.sin(time * 0.000874) * 0.5
}

function getIslandsInfluence(alpha: number, objects: IObjects) {
    if (alpha < 0) {
        const a = -alpha
        const b = 1 - a
        return objects.volcano.transfo.y * a
            + objects.stone.transfo.y * b
    }
    const aa = alpha
    const bb = 1 - aa
    return objects.molino.transfo.y * aa
        + objects.stone.transfo.y * bb
}
