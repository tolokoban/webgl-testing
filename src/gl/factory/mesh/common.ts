import AssetsMap from '../../assets-map'
import AsyncLoader from '../../async-loader'
import MeshDefinition, { IMeshDefinition } from './mesh-definition'

const MeshDefinitions = new AssetsMap<MeshDefinition>()


export default {
    createOrGetFromCacheMeshDefinition
}


async function createOrGetFromCacheMeshDefinition(definitionURL: string): Promise<MeshDefinition> {
    const id = definitionURL
    return MeshDefinitions.addAsync(
        definitionURL,
        async () => {
            const definition =
                (await AsyncLoader.loadJson(definitionURL)) as IMeshDefinition
            return new MeshDefinition(id, definition)
        }
    )
}
