// tslint:disable:no-magic-numbers
import Tfw from 'tfw'
import React from "react"
import Intro from './view/intro'
import Game from './view/game'
import Controls from './view/controls'
import GameManager from './manager/game'

import "./App.css"

Tfw.Font.loadJosefin()
Tfw.Font.loadMysteryQuest()

interface IAppProps {
    className?: string
}

interface IAppState {
    intro: boolean
}

export default class App extends React.Component<IAppProps, IAppState> {
    private gameManager = new GameManager()

    state = { intro: true }

    private handleStart = () => {
        this.setState({ intro: false })
    }

    render() {
        const { intro } = this.state
        const classes = ['App', 'thm-bg0']
        if (this.props.className) classes.push(this.props.className)

        return (<div className={classes.join(' ')}>
            {
                intro &&
                <Intro
                    onLoad={removeSplash}
                    onDone={this.handleStart}
                />
            }
            {
                !intro &&
                <Game gameManager={this.gameManager} />
            }
            {/*
                !intro &&
                <Controls gameManager={this.gameManager} />
            */}
        </div>)
    }
}


function removeSplash() {
    const splash = document.getElementById("splash")
    if (!splash) return
    splash.classList.add("hide")
    window.setTimeout(
        () => {
            const parent = splash.parentNode
            if (!parent) return
            parent.removeChild(splash)
        },
        1000
    )
}
