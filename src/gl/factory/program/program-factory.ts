import AssetsMap from '../../assets-map'
import Program from '../../program'
import ShaderFactory from '../shader'
import { IWebGL, IFriendlyVertexDefinition, IFriendlyFragmentDefinition } from '../../types'

export default class ProgramFactory {
    private programMap = new AssetsMap<Program>()

    constructor(private gl: IWebGL) { }

    async createProgramAsync(
        id: string,
        vertShader: Partial<IFriendlyVertexDefinition>,
        fragShader: Partial<IFriendlyFragmentDefinition>
    ): Promise<Program> {
        return this.programMap.addAsync(
            id,
            async () => {
                const { gl } = this
                const program = new Program(
                    gl,
                    ShaderFactory.createVertShader(vertShader),
                    ShaderFactory.createFragShader(fragShader)
                )
                await program.attach()
                return program
            }
        )
    }
}
