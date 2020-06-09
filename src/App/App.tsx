// tslint:disable:no-magic-numbers
import Tfw from 'tfw'
import React from "react"
import Intro from './view/intro'

import "./App.css"

Tfw.Font.loadJosefin()
Tfw.Font.loadMysteryQuest()

interface IAppProps {
    className?: string
}

export default class App extends React.Component<IAppProps, {}> {
    private handleStart = () => {
        
    }

    render() {
        const classes = ['App', 'thm-bg0']
        if (this.props.className) classes.push(this.props.className)

        return (<div className={classes.join(' ')}>
            <Intro
                onLoad={removeSplash}
                onDone={this.handleStart}
            />
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
