import Transfo from '../../gl/transfo'
import PolarLocSca from '../../gl/transfo/polar-loc-sca'

export default abstract class Painter<T extends Transfo = PolarLocSca> {
    abstract get transfo(): T
    abstract paint(time: number): void
}
