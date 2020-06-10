import React from "react"
import Tfw from 'tfw'
import Scene from '../../../gl/scene'
import PerspectiveCamera from '../../../gl/camera/perpective'
import Painter from '../../painter'
import Calc from '../../../gl/calc'

import "./preview.css"

interface IPreviewProps {
    className?: string
    painter(scene: Scene): Promise<Painter>
    name?: string
    type?: string
    x?: number
    y?: number
    z?: number
    dis?: number
    lat?: number
    onLoad?(): void
}

export default class Preview extends React.Component<IPreviewProps, {}> {
    private refCanvas = React.createRef<HTMLCanvasElement>()

    async componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas) return
        const scene = new Scene(canvas)
        scene.camera = new PerspectiveCamera()
        const painter = await this.props.painter(scene)
        const { gl } = scene

        const dis = this.props.dis || 4
        const lat = Calc.deg2rad(this.props.lat || 15)
        const x = this.props.x || 0
        const y = this.props.y || 0
        const z = this.props.z || 0

        scene.onAnimation = (time: number) => {
            gl.clearColor(0, 0, 0, 0)
            gl.clearDepth(+1)
            gl.depthFunc(gl.LESS)
            gl.enable(gl.DEPTH_TEST)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

            const lng = time * 0.001
            const camera = scene.camera as PerspectiveCamera
            camera.orbit(x, y, z, dis, lat, lng)

            painter.paint(time)
        }

        scene.isRendering = true
        if (typeof this.props.onLoad === 'function') this.props.onLoad()
    }

    render() {
        const classes = [
            'app-view-Preview',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]
        const { name, type } = this.props

        return (<div className={classes.join(' ')}>
            <canvas ref={this.refCanvas}></canvas>
            {name && <div className="name">{name}</div>}
            {type && <div className="type">{type}</div>}
        </div>)
    }
}
