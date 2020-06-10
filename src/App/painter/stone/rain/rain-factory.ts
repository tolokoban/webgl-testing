import Scene from '../../../../gl/scene'
import RainPainter from './rain'

import MainVertShader from './main.vert'
import MainFragShader from './main.frag'


const DROPS_COUNT = 200

export default {
    async createAsync(scene: Scene): Promise<RainPainter> {
        const arrayBuffer = scene.buffers.createArrayBuffer("particle.rain", createData())
        const program = await createProgramAsync(scene)
        return new RainPainter(scene, program, arrayBuffer, DROPS_COUNT)
    }
}

async function createProgramAsync(scene: Scene) {
    const { camera } = scene
    const program = await scene.programs.createProgramAsync(
        `[PARTICLE.RAIN]:${camera.id}`,
        {
            uniforms: {
                uniTime: "float",
                uniDropSize: "float",
                uniObjectTransfo: "mat4"
            },
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

const TIME_TO_FALL = 3000
const MAX_CYCLE = 1000

function createData(): Float32Array {
    const data: number[] = []
    for (let loop = 0; loop < DROPS_COUNT; loop++) {
        const cycleTime = Math.floor(rnd(TIME_TO_FALL, TIME_TO_FALL + MAX_CYCLE))
        const shiftTime = Math.floor(rnd(0, TIME_TO_FALL))
        data.push(
            rnd(-1, +1),
            8,
            rnd(-2, +2),
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
