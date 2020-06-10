import React from "react"
import Tfw from 'tfw'



import "./game.css"

const Button = Tfw.View.Button
const _ = Tfw.Intl.make(require("./game.yaml"))

interface IGameProps {
    className?: string[]
}
interface IGameState {
    loaded: boolean
}

export default class Game extends React.Component<IGameProps, IGameState> {
    private refCanvas = React.createRef<HTMLCanvasElement>()

    state = {        loaded: false    }

    async componentDidMount() {
        const canvas =  this.refCanvas.current
        if (!canvas) return

        
    }

    render() {
        const classes = [
            'app-view-Game',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return <canvas ref={this.refCanvas} className={classes.join(' ')}></canvas>
    }
}
