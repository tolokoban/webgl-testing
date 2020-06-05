import Mesh from '../mesh'
import Scene from '../../scene'
import Program from '../../program'
import Texture from '../../texture'
import ArrayBuffer from '../../buffer/array-buffer'

interface IFresnelMeshParams {
    scene: Scene
    attributesCount: number
    arrayBuffer: ArrayBuffer
    colorTexture: Texture
    program: Program
}

export default class FresnelMesh extends Mesh {
    constructor(private params: IFresnelMeshParams) {
        super()
    }

    get program() { return this.params.program }

    paint(time: number) {
        const { scene, arrayBuffer, colorTexture, program, attributesCount } = this.params
        const { gl, camera } = scene

        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
        program.use()
        camera.setUniformValues(program, scene.width, scene.height, time)
        colorTexture.attachToUnit(0)
        program.uniforms.set("uniObjectTransfo", this.transfo)
        program.uniforms.set("uniTexture", 0)
        program.bindAttribs(arrayBuffer.buffer)
        gl.drawArrays(gl.TRIANGLES, 0, attributesCount)
    }

    destroy() {
        const { arrayBuffer, colorTexture } = this.params
        arrayBuffer.destroy()
        colorTexture.destroy()
    }
}
