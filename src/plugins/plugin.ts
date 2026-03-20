import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { MagicMirrorClient } from "../client/MagicMirrorClient.js"
import { HomeAssistantClient } from "../client/HomeAssistantClient.js"

export interface PluginContext {
  mirrorClient: MagicMirrorClient
  haClient: HomeAssistantClient
}

export interface MCPPlugin {
  name: string
  register(server: McpServer, context: PluginContext): Promise<void>
}
