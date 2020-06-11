import Scene from '../../../../gl/scene'
import Painter from '../../painter'
import Transfo from '../../../../gl/transfo/static-transfo'
import Program from '../../../../gl/program'
import ArrayBuffer from '../../../../gl/buffer/array-buffer'


const DROP_SIZE = 2

export default class SmokePainter extends Painter<Transfo> {
    private _transfo = new Transfo(0, 0, 0)

    constructor(
        private scene: Scene,
        private program: Program,
        private arrayBuffer: ArrayBuffer,
        private dropsCount: number
    ) {
        super()
    }

    get transfo() { return this._transfo }

    paint(time: number) {
        const { scene, program, arrayBuffer, dropsCount } = this
        const { gl, camera } = scene

        gl.depthMask(false)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.DST_ALPHA)

        program.use()
        camera.setUniformValues(program, scene.width, scene.height, time)
        program.uniforms.set("uniObjectTransfo", this.transfo.value)
        program.uniforms.set("uniTime", time)
        program.uniforms.set(
            "uniDropSize",
            Math.min(scene.width, scene.height) * DROP_SIZE
        )
        program.bindAttribs(arrayBuffer.buffer)
        gl.drawArrays(gl.POINTS, 0, dropsCount)

        gl.disable(gl.BLEND)
        gl.depthMask(true)
    }
}
