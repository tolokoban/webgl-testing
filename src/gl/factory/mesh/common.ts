import AssetsMap from '../../assets-map'
import AsyncLoader from '../../async-loader'
import MeshDefinition, { IMeshDefinition } from './mesh-definition'

const MeshDefinitions = new AssetsMap<MeshDefinition>()


export default {
    createOrGetFromCacheMeshDefinition
}


async function createOrGetFromCacheMeshDefinition(definitionURL: string): Promise<MeshDefinition> {
    const id = definitionURL
    if (!MeshDefinitions.exists(definitionURL)) {
        const definition = (await AsyncLoader.loadJson(definitionURL)) as IMeshDefinition
        MeshDefinitions.add(id, new MeshDefinition(id, definition))
    }
    return MeshDefinitions.get(id) as MeshDefinition
}
