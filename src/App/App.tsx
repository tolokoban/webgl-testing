// tslint:disable:no-magic-numbers
import Tfw from 'tfw'
import React from "react"
import Scene from '../gl/scene'
import WorldObj from './world-obj'
import WorldObjFactory from './world-obj-factory'
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
    scaleY: number
}

export default class App extends React.Component<IAppProps, IAppState> {
    state = {
        thickness: 2,
        distance: 35,
        scaleY: 1
    }

    private refCanvas = React.createRef<HTMLCanvasElement>()
    private scene?: Scene

    async componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas) return
        const scene = new Scene(canvas)
        scene.camera = new PerspectiveCamera()
        const { gl } = scene

        //const car = await WorldObj.createAsync(scene, "./assets/mesh/Car.json")
        const balzac = await WorldObjFactory.createAsync(scene, "./assets/mesh/Balzac.json")
        balzac.transfo.x = 13.5
        const islandA = await WorldObjFactory.createAsync(scene, "./assets/mesh/Island-A.json")
        const islandB = await WorldObjFactory.createAsync(scene, "./assets/mesh/Island-B.json")
        islandB.transfo.x = 30
        const helixIslandB = await WorldObjFactory.createAsync(scene, "./assets/mesh/Helix.json")
        helixIslandB.transfo.x = 30
        helixIslandB.transfo.y = 10
        helixIslandB.transfo.sx = 10
        helixIslandB.transfo.sy = 10
        helixIslandB.transfo.sz = 10
        const stone = await WorldObjFactory.createAsync(scene, "./assets/mesh/Stone.json")
        stone.transfo.x = 13.5
        const helixStone = await WorldObjFactory.createAsync(scene, "./assets/mesh/Helix.json")
        helixStone.transfo.x = 13.5
        helixStone.transfo.y = -1
        helixStone.transfo.sx = 3
        helixStone.transfo.sy = 3
        helixStone.transfo.sz = 3

        let dis = 200
        let disTarget = 35
        let lat = Calc.deg2rad(30)
        let lng = Calc.deg2rad(-40)
        let lastTime = 0
        let lat0 = lat
        let lng0 = lng
        let x0 = 0
        let y0 = 0

        document.addEventListener("wheel", (evt: WheelEvent) => {
            if (evt.deltaY < 0) disTarget *= 0.9
            else if (evt.deltaY > 0) disTarget *= 1.1
        })

        scene.onAnimation = (time: number) => {
            const delta = time - lastTime
            lastTime = time

            //gl.clearColor(0, 0.4, 0.867, 1.0)
            gl.clearColor(0.3, 0.5, 0.9, 1.0)
            gl.clearDepth(+1)
            gl.depthFunc(gl.LESS)
            gl.enable(gl.DEPTH_TEST)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

            balzac.thickness = this.state.thickness
            // island.color[0] = 1 - Math.abs(Math.cos(time * 0.003))
            // island.color[1] = island.color[0] * 0.5
            // car.y = Math.abs(Math.cos(time * 0.002)) * 3
            // car.x = 3 + Math.sin(time * 0.002) * 3
            // car.scaleY = this.state.scaleY
            helixIslandB.transfo.lng = -time * 0.1
            helixIslandB.transfo.y = islandB.transfo.y + 10
            helixStone.transfo.lng = -time * 0.17

            if (scene.pointer.eventDown) {
                lat0 = lat
                lng0 = lng
                x0 = scene.pointer.x
                y0 = scene.pointer.y
            }

            islandA.transfo.y = 0.5 * (Math.cos(time * 0.002045) * Math.sin(time * 0.005742))
            islandB.transfo.y = 0.4 * (Math.cos(time * 0.000945) * Math.sin(time * 0.001742))
            stone.transfo.y = 0.3 * (Math.cos(time * 0.001045) * Math.sin(time * 0.002742))

            balzac.transfo.y = 0
            snapToGround(balzac, islandA, stone, islandB)

            if (scene.pointer.down) {
                lat = lat0 + scene.pointer.y - y0
                lng = lng0 - scene.pointer.x + x0
            }

            if (dis < disTarget) {
                dis = Math.min(disTarget, dis + delta * 0.1)
            } else {
                dis = Math.max(disTarget, dis - delta * 0.1)
            }

            const camera = scene.camera as PerspectiveCamera
            camera.orbit(stone.transfo.x, 1, 0, dis, lat, lng)


            islandA.paint(time)
            islandB.paint(time)
            helixIslandB.paint(time)
            stone.paint(time)
            helixStone.paint(time)
            balzac.paint(time)
        }

        this.scene = scene
        scene.isRendering = true
    }

    render() {
        const classes = ['App', 'thm-bg0']
        if (this.props.className) classes.push(this.props.className)

        return (<div className={classes.join(' ')}>
            <canvas ref={this.refCanvas}></canvas>
            {/*
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
                    label="Scale Y"
                    min={-3}
                    max={3}
                    step={0.1}
                    value={this.state.scaleY}
                    onChange={scaleY => this.setState({ scaleY })}
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
            */}
        </div>)
    }
}


function snapToGround(
    character: WorldObj,
    islandA: WorldObj,
    stone: WorldObj,
    islandB: WorldObj
) {
    const yA = islandA.transfo.y
    const yS = stone.transfo.y
    const yB = islandB.transfo.y

    character.transfo.y += yS
}
