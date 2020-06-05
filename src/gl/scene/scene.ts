import Pointer from '../pointer'
import Resize from '../resize'
import TextureFactory from '../factory/texture'
import ProgramFactory from '../factory/program'
import BufferFactory from '../factory/buffer'
import Camera from '../camera'
import PerspectiveCamera from '../camera/perpective'
import { IWebGL } from '../types'

type IAnimationFunction = (time: number, width: number, height: number) => void
export interface ISceneParams {
    canvas: HTMLCanvasElement
    onAnimation?: IAnimationFunction
}

export default class Scene {
    resolution = 1
    onAnimation?: IAnimationFunction

    private readonly _gl: IWebGL
    private readonly _pointer: Pointer
    private _isRendering = false
    private lastRenderingTime = 0
    public readonly textures: TextureFactory
    public readonly buffers: BufferFactory
    public readonly programs: ProgramFactory
    public camera: Camera = new PerspectiveCamera()

    constructor(canvas: HTMLCanvasElement) {
        this._pointer = new Pointer(canvas)
        let gl: IWebGL | null = canvas.getContext('webgl2', {
            // Specify WebGL options.
        })
        if (!gl) {
            console.warn("WebGL2 is not available! Switching to WebGL.")
            gl = canvas.getContext('webgl', {
                // Specify WebGL options.
            })
        }
        if (!gl) {
            throw new Error('Unable to create a WegGL context!')
        }

        this._gl = gl
        this.textures = new TextureFactory(gl)
        this.buffers = new BufferFactory(gl)
        this.programs = new ProgramFactory(gl)
    }

    get isRendering() { return this._isRendering }
    set isRendering(value: boolean) {
        if (value === this._isRendering) return
        this._isRendering = value
        if (value) {
            window.requestAnimationFrame(this.render)
        }
    }

    get gl(): IWebGL {
        return this._gl
    }

    /**
     * Retreive information about pointer (mouse, pen, finger, ...) state.
     */
    get pointer() {
        return this._pointer
    }

    /**
     * Visible width. Between 0 and 1024.
     */
    get width(): number {
        return this._gl.drawingBufferWidth
    }
    /**
     * Visible height. Between 0 and 1024.
     */
    get height(): number {
        return this._gl.drawingBufferHeight
    }

    /**
     * Trigger a rendering now.
     */
    refresh() {
        const savedRendering = this._isRendering
        const savedLastRenderingTime = this.lastRenderingTime
        this._isRendering = true
        const time = Date.now()
        this.lastRenderingTime = time - 15
        this.render(time)
        this._isRendering = savedRendering
        this.lastRenderingTime = savedLastRenderingTime
    }

    private readonly render = (time: number) => {
        if (!this._isRendering) return
        window.requestAnimationFrame(this.render)

        const { gl, lastRenderingTime } = this
        this.lastRenderingTime = time
        if (lastRenderingTime === 0) {
            // Skip the first frame to have a correct delta time.
            return
        }

        Resize(gl, this.resolution)

        gl.clearDepth(+1)
        gl.clear(gl.DEPTH_BUFFER_BIT)
        gl.depthFunc(gl.LESS)
        gl.disable(gl.DEPTH_TEST)

        try {
            const { onAnimation } = this
            if (typeof onAnimation === 'function') {
                const width = gl.drawingBufferWidth
                const height = gl.drawingBufferHeight
                onAnimation(time, width, height)
                this.pointer.reset()
            }
        } catch (ex) {
            this._isRendering = false
            console.error('##################################')
            console.error('# Rendering   has  been  stopped #')
            console.error('# because of the following error #')
            console.error('##################################')
            console.error(ex)
        }
    }
}
