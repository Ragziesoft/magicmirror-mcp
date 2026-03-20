import { MagicMirrorClient, Module } from "../client/MagicMirrorClient.js"
import { HomeAssistantClient } from "../client/HomeAssistantClient.js"

export interface DiscoveredSystem {
  mirror: {
    available: boolean
    modules: Module[]
  }
  homeAssistant: {
    available: boolean
    entityIds: string[]
  }
}

export class DiscoveryService {

  constructor(
    private mirrorClient: MagicMirrorClient,
    private haClient: HomeAssistantClient
  ) {}

  async discover(): Promise<DiscoveredSystem> {

    const [mirrorResult, haResult] = await Promise.allSettled([
      this.mirrorClient.listModules(),
      this.haClient.listStates()
    ])

    const mirrorModules: Module[] =
      mirrorResult.status === "fulfilled" && mirrorResult.value?.data
        ? mirrorResult.value.data
        : []

    const haEntityIds: string[] =
      haResult.status === "fulfilled" && Array.isArray(haResult.value)
        ? haResult.value.map((e: { entity_id: string }) => e.entity_id)
        : []

    return {
      mirror: {
        available: mirrorResult.status === "fulfilled",
        modules: mirrorModules
      },
      homeAssistant: {
        available: haResult.status === "fulfilled",
        entityIds: haEntityIds
      }
    }

  }

}
