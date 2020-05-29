import { IWebGL } from '../../types'

type ITarget = "2d" | "cubeMap" | "3d" | "2dArray"

export default abstract class Texture {
    private sharingCounter = 0
    private _isDestroyed = false
    protected readonly texture: WebGLTexture
    protected readonly target: GLenum
    protected readonly units: GLenum[]

    constructor(
        protected readonly gl: IWebGL,
        protected readonly id: string,
        target: ITarget
    ) {
        const texture = gl.createTexture()
        if (!texture) throw Error(`[FlatLand] Unable to create texture "${id}"!`)
        this.texture = texture
        switch (target) {
            case "2d":
                this.target = gl.TEXTURE_2D
                break
            case "cubeMap":
                this.target = gl.TEXTURE_CUBE_MAP
                break
            /*
            case "3d":
                this.target = gl.TEXTURE_3D
                break
            case "2dArray":
                this.target = gl.TEXTURE_2D_ARRAY
                break
            */
            default:
                throw Error(`[FlatLand.Texture] Unknow target "${target}"! Available targets are "2d", "cubeMap", "3d" and "2dArray".`)
        }
        this.units = [
            gl.TEXTURE0,
            gl.TEXTURE1,
            gl.TEXTURE2,
            gl.TEXTURE3,
            gl.TEXTURE4,
            gl.TEXTURE5,
            gl.TEXTURE6,
            gl.TEXTURE7,
            gl.TEXTURE8,
            gl.TEXTURE9,
            gl.TEXTURE10,
            gl.TEXTURE11,
            gl.TEXTURE12,
            gl.TEXTURE13,
            gl.TEXTURE14,
            gl.TEXTURE15
        ]
    }

    get isDestroyed() { return this._isDestroyed }

    /**
     * Many painters can share the same texture.
     * For memory management, it's important to know
     * how many users this texture has to be shared with.
     *
     * Call share() as soon as you need to use a texture
     * and destroy() as soon as you don't need it anymore.
     */
    share() {
        this.sharingCounter++
    }

    /**
     * Remove the texture from the graphic card memory
     * as soon as no one is using it anymore.
     */
    destroy() {
        if (this._isDestroyed) return

        if (this.sharingCounter > 0) {
            this.sharingCounter--
            return
        }
        const { gl, texture } = this
        gl.deleteTexture(texture)
        this._isDestroyed = true
    }

    /**
     * Attach this texture to a unit.
     * If you use only one unit, your texture must be attached to unit 0.
     */
    attachToUnit(unitIndex: number) {
        const { gl, texture, target, units } = this
        if (unitIndex < 0) throw Error("[FlatLand.Texture.attachToUnit] unitIndex must be positive!")
        if (unitIndex > units.length - 1) throw Error(`[FlatLand.Texture.attachToUnit] unitIndex must be lower than ${units.length}!`)
        gl.activeTexture(units[unitIndex])
        gl.bindTexture(target, texture)
    }
}
