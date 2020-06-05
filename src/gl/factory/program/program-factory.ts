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
        if (this.programMap.exists(id)) {
            return this.programMap.get(id) as Program
        }

        const { gl } = this
        const program = new Program(
            gl,
            ShaderFactory.createVertShader(vertShader),
            ShaderFactory.createFragShader(fragShader)
        )
        await program.attach()
        this.programMap.add(id, program)
        return program
    }
}
