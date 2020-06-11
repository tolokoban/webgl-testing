import React from "react"
import Tfw from 'tfw'
import GameManager from '../../manager/game'


import "./controls.css"

const Button = Tfw.View.Button
const _ = Tfw.Intl.make(require("./controls.yaml"))

interface IControlsProps {
    className?: string | string[]
    gameManager: GameManager
}

interface IControlsState {}

export default class Controls extends React.Component<IControlsProps, IControlsState> {
    state = {}

    render() {
        const classes = [
            'app-view-Controls',
            ...Tfw.Converter.StringArray(this.props.className, [])
        ]

        return (<div className={classes.join(' ')}>
        <Button icon="right" label='Jump'  />
        <Button icon="undo" label='Undo'  />
        </div>)
    }
}
