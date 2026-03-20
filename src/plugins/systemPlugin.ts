import { MCPPlugin } from "./plugin.js"
import { SchemaGenerator } from "../services/schemaGenerator.js"

const systemPlugin: MCPPlugin = {

  name: "system",

  async register(server, context) {

    const generator = new SchemaGenerator(context.mirrorClient, context.haClient)

    server.tool(
      "system.schema",
      "Discover the capabilities of the connected MagicMirror and Home Assistant. Returns a list of installed mirror modules and available HA entity IDs so the AI agent can understand what is available to control.",
      {},
      async () => {
        try {
          const schema = await generator.generate()
          return { content: [{ type: "text", text: JSON.stringify(schema, null, 2) }] }
        } catch (err) {
          return { content: [{ type: "text", text: `Error generating system schema: ${err}` }], isError: true }
        }
      }
    )

  }

}

export default systemPlugin
