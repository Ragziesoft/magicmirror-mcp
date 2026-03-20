import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MagicMirrorClient } from "./client/MagicMirrorClient.js";
import { HomeAssistantClient } from "./client/HomeAssistantClient.js";
import { loadPlugins } from "./pluginLoader.js";
async function start() {
    const mirrorClient = new MagicMirrorClient({
        baseUrl: process.env.MAGICMIRROR_URL || "",
        apiKey: process.env.MAGICMIRROR_API_KEY || ""
    });
    const haClient = new HomeAssistantClient({
        baseUrl: process.env.HOMEASSISTANT_URL || "",
        token: process.env.HOMEASSISTANT_TOKEN || ""
    });
    const server = new McpServer({
        name: "magicmirror-mcp",
        version: "2.0.0"
    });
    await loadPlugins(server, { mirrorClient, haClient });
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
start().catch(console.error);
