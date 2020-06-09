import React from "react"
import Tfw from 'tfw'



import "./game.css"

const Button = Tfw.View.Button
const _ = Tfw.Intl.make(require("./game.yaml"))

interface IGameProps {
    className?: string[]
}
interface IGameState {}

export default class Game extends React.Component<IGameProps, IGameState> {
    state = {}

    render() {
        const classes = [
            'app-view-Game',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
            <Button label={_('ok')} />
        </div>)
    }
}
