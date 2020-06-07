import Mesh from '../mesh'
import Scene from '../../scene'
import Program from '../../program'
import Transfo from '../../transfo'
import ArrayBuffer from '../../buffer/array-buffer'

interface IFresnelMeshParams {
    scene: Scene
    transfo: Transfo
    attributesCount: number
    arrayBuffer: ArrayBuffer
    program: Program
}

const R = 0
const G = 1
const B = 2
const A = 3

export default class OutlineMesh extends Mesh {
    public readonly color = new Float32Array([0, 0, 0, 1])
    public thickness = 2

    constructor(private params: IFresnelMeshParams) {
        super(params.transfo)
        console.info("params=", params)
    }

    get program() { return this.params.program }

    setRGB(r: number, g: number, b: number) {
        const { color } = this
        color[R] = r
        color[G] = g
        color[B] = b
    }

    setRGBA(r: number, g: number, b: number, a: number) {
        const { color } = this
        color[R] = r
        color[G] = g
        color[B] = b
        color[A] = a
    }

    paint(time: number) {
        const THICKNESS_MULTIPLIER = 0.001
        const { scene, arrayBuffer, program, attributesCount } = this.params
        const { gl, camera } = scene
        gl.enable(gl.CULL_FACE)
        // The trick for outlining is to show only back faces.
        gl.cullFace(gl.FRONT)
        program.use()
        camera.setUniformValues(program, scene.width, scene.height, time)
        program.uniforms.set("uniColor", this.color)
        program.uniforms.set("uniThickness", this.thickness * THICKNESS_MULTIPLIER)
        program.uniforms.set("uniObjectTransfo", this.transfo.value)
        program.bindAttribs(arrayBuffer.buffer)
        gl.drawArrays(gl.TRIANGLES, 0, attributesCount)
    }

    destroy() {
        const { arrayBuffer } = this.params
        arrayBuffer.destroy()
    }
}
