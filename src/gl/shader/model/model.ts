import ShaderFactory from '../../factory/shader'
import PerspectiveCamera from '../../camera/perpective'

import FragShaderMain from './model.main.frag'
import VertShaderMain from './model.main.vert'


console.info("PerspectiveCamera.VertexShader=", PerspectiveCamera.VertexShader)

export default {
    vert: ShaderFactory.createVertShader({
        attributes: {
            attLocation: "vec3",
            attUV: "vec2",
            attNormal: "vec3",
            attValley: "vec3",
            attWeight: "vec3"
        },
        varyings: {
            varNormal: "vec3",
            varValley: "vec3",
            varWeight: "vec3",
            varUV: "vec2"
        },
        functions: {
            main: VertShaderMain
        },
        dependencies: [PerspectiveCamera.VertexShader]
    }),
    frag: ShaderFactory.createFragShader({
        uniforms: {
            uniTexture: "sampler2D",
            uniThickness: "float",
            uniSmoothness: "float"
        },
        functions: {
            main: FragShaderMain
        }
    })
}
