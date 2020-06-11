import Scene from '../../../../gl/scene'
import SmokePainter from './smoke'

import MainVertShader from './main.vert'
import MainFragShader from './main.frag'


const DROPS_COUNT = 100
const BASE_RADIUS = 0.5
const LIFE_TIME = 20000
const EXTRA_LIFE_TIME = 1000


export default {
    async createAsync(scene: Scene): Promise<SmokePainter> {
        const arrayBuffer = scene.buffers.createArrayBuffer("particle.smoke", createData())
        const program = await createProgramAsync(scene)
        return new SmokePainter(scene, program, arrayBuffer, DROPS_COUNT)
    }
}

async function createProgramAsync(scene: Scene) {
    const { camera } = scene
    const program = await scene.programs.createProgramAsync(
        `[PARTICLE.SMOKE]:${camera.id}`,
        {
            uniforms: {
                uniTime: "float",
                uniDropSize: "float",
                uniObjectTransfo: "mat4"
            },
            varyings: { varTime: "float" },
            attributes: {
                attLocation: "vec3",
                attShift: "float",
                attCycle: "float",
                attCycleInv: "float"
            },
            functions: { main: MainVertShader },
            dependencies: [camera.vertexShader]
        },
        {
            functions: { main: MainFragShader }
        }
    )
    return program
}

function createData(): Float32Array {
    const data: number[] = []
    for (let loop = 0; loop < DROPS_COUNT; loop++) {
        const cycleTime = Math.floor(rnd(LIFE_TIME, LIFE_TIME + EXTRA_LIFE_TIME))
        const shiftTime = Math.floor(rnd(0, LIFE_TIME))
        data.push(
            rnd(-BASE_RADIUS, +BASE_RADIUS),
            0,
            rnd(-BASE_RADIUS, +BASE_RADIUS),
            shiftTime,
            cycleTime,
            1 / cycleTime
        )
    }
    return new Float32Array(data)
}


function rnd(min: number, max: number): number {
    return min + (max - min) * Math.random()
}
