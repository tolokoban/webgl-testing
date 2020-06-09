import React from "react"
import Tfw from 'tfw'
import Hero from '../hero'

import "./intro.css"

const _ = Tfw.Intl.make(require("./intro.json"))
const Button = Tfw.View.Button

interface IIntroProps {
    onLoad(): void
    onDone(): void
}

interface IIntroState {
    page: number
    golgoth: boolean
    balzac: boolean
    hydre: boolean
    tyson: boolean
    done: boolean
}

export default class Intro extends React.Component<IIntroProps, IIntroState> {
    state = {
        page: 0,
        golgoth: false,
        balzac: false,
        hydre: false,
        tyson: false,
        done: false
    }

    handleLoad = (name: keyof IIntroState) => {
        switch (name) {
            case "golgoth":
                this.setState({ golgoth: true }, this.checkIsLoaded)
                break
            case "balzac":
                this.setState({ balzac: true }, this.checkIsLoaded)
                break
            case "hydre":
                this.setState({ hydre: true }, this.checkIsLoaded)
                break
            case "tyson":
                this.setState({ tyson: true }, this.checkIsLoaded)
                break
            default:
                throw Error("Impossible!")
        }
    }

    private checkIsLoaded = () => {
        if (!this.state.golgoth) return
        if (!this.state.balzac) return
        if (!this.state.hydre) return
        if (!this.state.tyson) return

        this.props.onLoad()
    }

    private page(sectionPage: number) {
        const { page } = this.state
        if (page === sectionPage) return 'in'
        if (page > sectionPage) return 'out'
        return ''
    }

    private handleNextPage = () => {
        if (this.state.page > 3) {
            this.setState({ done: true })
            window.setTimeout(this.props.onDone, 500)
        }
        this.setState({ page: this.state.page + 1 })
    }

    render() {
        const classes = ['app-Intro']
        if (this.state.done) {
            classes.push("hide")
        }

        return (<div className={classes.join(' ')}>
            <Hero
                y={1}
                className="golgoth"
                file="Golgoth.json"
                name="golgoth"
                type={_('type-golgoth')}
                onLoad={() => this.handleLoad("golgoth")}
            />
            <Hero
                y={1}
                className="balzac"
                file="Balzac.json"
                name="balzac"
                type={_('type-balzac')}
                onLoad={() => this.handleLoad("balzac")}
            />
            <Hero
                y={0}
                className="hydre"
                file="Hydre.json"
                name="hydre"
                type={_('type-hydre')}
                onLoad={() => this.handleLoad("hydre")}
            />
            <Hero
                y={1}
                className="tyson"
                file="Tyson.json"
                name="tyson"
                type={_('type-tyson')}
                onLoad={() => this.handleLoad("tyson")}
            />
            <div className="story">
                <section className={this.page(0)}>
                    <p>{_('story1')}</p>
                    <Hero
                        className="small-canvas"
                        dis={42}
                        lat={45}
                        file="Island-A.json"
                    />
                    <Button
                        icon="right"
                        warning={true}
                        onClick={this.handleNextPage}
                    />
                </section>
                <section className={this.page(1)}>
                    <p>{_('story2a')}</p>
                    <div className="big">17''</div>
                    <p>{_('story2b')}</p>
                    <Button
                        icon="right"
                        warning={true}
                        onClick={this.handleNextPage}
                    />
                </section>
                <section className={this.page(2)}>
                    <p>{_('story3')}</p>
                    <Hero
                        className="small-canvas"
                        dis={38}
                        lat={45}
                        file="Island-B.json"
                    />
                    <Button
                        icon="right"
                        warning={true}
                        onClick={this.handleNextPage}
                    />
                </section>
                <section className={this.page(3)}>
                    <p>{_('story4')}</p>
                    <Hero
                        className="small-canvas"
                        dis={20}
                        lat={40}
                        y={4}
                        file="Stone.json"
                    />
                    <Button
                        icon="right"
                        warning={true}
                        onClick={this.handleNextPage}
                    />
                </section>
                <section className={this.page(4)}>
                    <p>{_('story5')}</p>
                    <Hero
                        className="small-canvas"
                        dis={10}
                        lat={20}
                        y={0}
                        file="Umbrella.json"
                    />
                    <Button
                        icon="right"
                        warning={true}
                        onClick={this.handleNextPage}
                    />
                </section>
            </div>
        </div>)
    }
}
