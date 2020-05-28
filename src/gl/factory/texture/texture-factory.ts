import AsyncLoader from '../../async-loader'
//import Texture from './texture/image-texture'
import ImageTexture from './image-texture'
import { IWebGL } from '../../types'

export default class TextureFactory {
    constructor(private gl: IWebGL) { }

    async createImageTextureAsync(url: string): Promise<ImageTexture> {
        const { gl } = this
        const img = await AsyncLoader.loadImage(url)
        const texture = new ImageTexture({
            gl,
            id: url,
            source: img,
            width: img.width,
            height: img.height,
            linear: false
        })
        return texture
    }
}
