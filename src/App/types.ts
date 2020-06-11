import GolgothPainter from './painter/golgoth'
import BalzacPainter from './painter/balzac'
import HydrePainter from './painter/hydre'
import TysonPainter from './painter/tyson'
import VolcanoPainter from './painter/volcano'
import StonePainter from './painter/stone'
import MolinoPainter from './painter/molino'
import UmbrellaPainter from './painter/umbrella'

export interface IObjects {
    volcano: VolcanoPainter,
    stone: StonePainter,
    molino: MolinoPainter,
    umbrella: UmbrellaPainter,
    tyson: TysonPainter,
    hydre: HydrePainter,
    balzac: BalzacPainter,
    golgoth: GolgothPainter
}
