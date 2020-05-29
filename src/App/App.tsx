// tslint:disable:no-magic-numbers
import Tfw from 'tfw'
import React from "react"
import Scene from '../gl/scene'
import ModelFactory from '../gl/factory/model'
import PerspectiveCamera from '../gl/camera/perpective'
import Calc from '../gl/calc'

import "./App.css"

const Slider = Tfw.View.Slider

interface IAppProps {
    className?: string
}

interface IAppState {
    thickness: number
    smoothness: number
    latitude: number
    longitude: number
    distance: number
}

export default class App extends React.Component<IAppProps, IAppState> {
    state = {
        thickness: 0.1,
        smoothness: 0.5,
        latitude: 20,
        longitude: 30,
        distance: 25
    }

    private refCanvas = React.createRef<HTMLCanvasElement>()
    private scene?: Scene
    private camera = new PerspectiveCamera()

    async componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas) return
        const scene = new Scene(canvas)
        const modelFactory = new ModelFactory(scene)
        const car = await modelFactory.createAsync("./mesh/Car.json")
        const { gl } = scene

        scene.onAnimation = (time: number, width: number, height: number) => {
            //gl.clearColor(0, 0.4, 0.867, 1.0)
            gl.clearColor(0.2, 0.3, 0.4, 1.0)
            gl.clearDepth(+1)
            gl.depthFunc(gl.LESS)
            gl.enable(gl.DEPTH_TEST)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            this.camera.setUniformValues(car.program, width, height)
            car.paint()
        }

        this.scene = scene
        scene.isRendering = false
        this.refresh()
    }

    componentDidUpdate() {
        this.refresh()
    }

    private refresh = Tfw.Throttler(
        () => {
            const { distance, latitude, longitude } = this.state
            this.camera.orbit(
                0, 0, 0,
                distance, Calc.deg2rad(latitude), Calc.deg2rad(longitude)
            )
            if (this.scene) this.scene.refresh()
        },
        50
    )

    render() {
        const classes = ['App', 'thm-bg0']
        if (this.props.className) classes.push(this.props.className)

        return (<div className={classes.join(' ')}>
            <div className="controls">
                <canvas ref={this.refCanvas}></canvas>
                <Slider
                    label="Latitude"
                    min={-89}
                    max={+89}
                    step={1}
                    value={this.state.latitude}
                    onChange={latitude => this.setState({ latitude })}
                />
                <Slider
                    label="Longitude"
                    min={-180}
                    max={+180}
                    step={1}
                    value={this.state.longitude}
                    onChange={longitude => this.setState({ longitude })}
                />
                <Slider
                    label="Distance"
                    min={1}
                    max={50}
                    step={1}
                    value={this.state.distance}
                    onChange={distance => this.setState({ distance })}
                />
            </div>
        </div>)
    }
}
