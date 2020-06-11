import React from "react"
import Tfw from 'tfw'
import Calc from '../../../gl/calc'
import Scene from '../../../gl/scene'
import GameManager from '../../manager/game'
import PerspectiveCamera from '../../../gl/camera/perpective'
import GolgothPainter from '../../painter/golgoth'
import BalzacPainter from '../../painter/balzac'
import HydrePainter from '../../painter/hydre'
import TysonPainter from '../../painter/tyson'
import VolcanoPainter from '../../painter/volcano'
import StonePainter from '../../painter/stone'
import MolinoPainter from '../../painter/molino'
import UmbrellaPainter from '../../painter/umbrella'

import { IObjects } from '../../types'

import "./game.css"

//const _ = Tfw.Intl.make(require("./game.yaml"))

interface IGameProps {
    className?: string | string[]
    gameManager: GameManager
}
interface IGameState {
    loaded: boolean
}

export default class Game extends React.Component<IGameProps, IGameState> {
    private refCanvas = React.createRef<HTMLCanvasElement>()
    private camera = new PerspectiveCamera()
    private scene?: Scene
    private objects?: IObjects

    state = { loaded: false }

    async componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas) return
        const scene = new Scene(canvas)
        this.scene = scene
        this.initCamera(scene)
        this.objects = {
            volcano: await VolcanoPainter.createAsync(scene),
            molino: await MolinoPainter.createAsync(scene),
            umbrella: await UmbrellaPainter.createAsync(scene),
            tyson: await TysonPainter.createAsync(scene),
            hydre: await HydrePainter.createAsync(scene),
            balzac: await BalzacPainter.createAsync(scene),
            golgoth: await GolgothPainter.createAsync(scene),
            stone: await StonePainter.createAsync(scene)
        }

        scene.onAnimation = this.sceneRender
        scene.isRendering = true

        this.setState({ loaded: true })
    }

    private initCamera(scene: Scene) {
        const { camera } = this
        scene.camera = camera
        camera.orbit(0, 0, 0, 40, Calc.deg2rad(30), Calc.deg2rad(0))
    }

    private sceneRender = (time: number) => {
        const { scene, objects } = this
        if (!scene || !objects) return
        const { gl } = scene

        gl.clearColor(0.3, 0.5, 0.9, 1.0)
        gl.clearDepth(+1)
        gl.depthFunc(gl.LESS)
        gl.enable(gl.DEPTH_TEST)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        for (const key of Object.keys(objects)) {
            const painter = objects[key as keyof IObjects]
            painter.paint(time)
        }

        this.move(time)
    }

    private move(time: number) {
        const { objects, scene, camera } = this
        if (!objects || !scene) return
        const gameManager = this.props.gameManager
        gameManager.play(time, objects, camera)
    }

    render() {
        const classes = [
            'app-view-Game',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        if (this.state.loaded) classes.push("show")

        return <canvas ref={this.refCanvas} className={classes.join(' ')}></canvas>
    }
}
