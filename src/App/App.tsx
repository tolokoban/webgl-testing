// tslint:disable:no-magic-numbers
import Tfw from 'tfw'
import React from "react"
import Scene from '../gl/scene'
import WorldObj from './world-obj'
import PerspectiveCamera from '../gl/camera/perpective'
import Calc from '../gl/calc'

import "./App.css"

const Slider = Tfw.View.Slider

interface IAppProps {
    className?: string
}

interface IAppState {
    thickness: number
    distance: number
}

export default class App extends React.Component<IAppProps, IAppState> {
    state = {
        thickness: 2,
        distance: 35
    }

    private refCanvas = React.createRef<HTMLCanvasElement>()
    private scene?: Scene

    async componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas) return
        const scene = new Scene(canvas)
        scene.camera = new PerspectiveCamera()
        const { gl } = scene

        const car = await WorldObj.createAsync(scene, "./assets/mesh/Car.json")
        const island = await WorldObj.createAsync(scene, "./assets/mesh/Island-A.json")
        island.thickness = 2

        let dis = 35
        let lat = 0
        let lng = 30

        scene.onAnimation = (time: number) => {
            //gl.clearColor(0, 0.4, 0.867, 1.0)
            gl.clearColor(0.2, 0.3, 0.4, 1.0)
            gl.clearDepth(+1)
            gl.depthFunc(gl.LESS)
            gl.enable(gl.DEPTH_TEST)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

            island.thickness = this.state.thickness
            car.thickness = this.state.thickness
            // island.color[0] = 1 - Math.abs(Math.cos(time * 0.003))
            // island.color[1] = island.color[0] * 0.5
            car.y = Math.abs(Math.cos(time * 0.002)) * 3
            car.x = 3 + Math.sin(time * 0.002) * 3

            lng = time * 0.000314
            lat = Math.cos(time * 0.0004841)
            dis = this.state.distance
            const camera = scene.camera as PerspectiveCamera
            camera.orbit(car.x, 0, 0, dis, lat, lng)

            island.paint(time)
            car.paint(time)
        }

        this.scene = scene
        scene.isRendering = true
    }

    render() {
        const classes = ['App', 'thm-bg0']
        if (this.props.className) classes.push(this.props.className)

        return (<div className={classes.join(' ')}>
            <canvas ref={this.refCanvas}></canvas>
            <div className="controls">
                <Slider
                    label="Thickness"
                    min={0}
                    max={20}
                    step={1}
                    value={this.state.thickness}
                    onChange={thickness => this.setState({ thickness })}
                />
                <Slider
                    label="Distance"
                    min={1}
                    max={100}
                    step={1}
                    value={this.state.distance}
                    onChange={distance => this.setState({ distance })}
                />
            </div>
        </div>)
    }
}
