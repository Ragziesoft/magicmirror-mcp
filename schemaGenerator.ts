import { MagicMirrorClient } from "../client/MagicMirrorClient.js"
import { HomeAssistantClient } from "../client/HomeAssistantClient.js"

export class SchemaGenerator {

  constructor(
    private mirror: MagicMirrorClient,
    private ha: HomeAssistantClient
  ) {}

  async generate() {

    const [modulesResult, haStates] = await Promise.allSettled([
      this.mirror.listModules(),
      this.ha.listStates()
    ])

    const mirrorModules = modulesResult.status === "fulfilled" && modulesResult.value?.data
      ? modulesResult.value.data.map((m: { name: string; identifier: string; hidden: boolean }) => ({
          name: m.name,
          identifier: m.identifier,
          hidden: m.hidden
        }))
      : []

    const homeAssistantEntities = haStates.status === "fulfilled" && Array.isArray(haStates.value)
      ? haStates.value.map((e: { entity_id: string; state: string }) => ({
          entity_id: e.entity_id,
          state: e.state
        }))
      : []

    return {
      mirrorModules,
      homeAssistantEntities,
      generatedAt: new Date().toISOString()
    }

  }

}
