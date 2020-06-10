import PolarLocSca from '../../gl/transfo/polar-loc-sca'

export default abstract class Painter {
    abstract get transfo(): PolarLocSca
    abstract paint(time: number): void
}
