import AsyncLoader from '../../async-loader'
import ImageTexture from './image-texture'
import CubeMapTexture from './cube-map-texture'
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

    /**
     * The pattern is used to load 6 images:
     * posX (1), negX (2), posY (3), negY (4), posZ (5) and negZ (6).
     *
     * The image index (1 to 6) will replace the question mark in the pattern.
     * Example:
     * createCubeMapTextureAsync("texture-000?.png")
     */
    async createCubeMapTextureAsync(urlPattern: string): Promise<CubeMapTexture> {
        const { gl } = this
        const parts = urlPattern.split('?')
        const imgPosX = await AsyncLoader.loadImage(parts.join("1"))
        const imgNegX = await AsyncLoader.loadImage(parts.join("2"))
        const imgPosY = await AsyncLoader.loadImage(parts.join("3"))
        const imgNegY = await AsyncLoader.loadImage(parts.join("4"))
        const imgPosZ = await AsyncLoader.loadImage(parts.join("5"))
        const imgNegZ = await AsyncLoader.loadImage(parts.join("6"))
        const texture = new CubeMapTexture({
            gl,
            id: urlPattern,
            sourcePosX: imgPosX,
            sourceNegX: imgNegX,
            sourcePosY: imgPosY,
            sourceNegY: imgNegY,
            sourcePosZ: imgPosZ,
            sourceNegZ: imgNegZ
        })
        return texture
    }
}
