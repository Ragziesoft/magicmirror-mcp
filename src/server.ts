import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z, ZodObject, ZodRawShape } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { MagicMirrorClient, MagicMirrorConfig } from "./api/client.js";
import { moduleTools } from "./tools/modules.js";
import { monitorTools } from "./tools/monitor.js";
import { alertTools } from "./tools/alerts.js";
import { systemTools } from "./tools/system.js";

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ZodObject<ZodRawShape>;
  handler: (input: Record<string, unknown>) => Promise<unknown>;
}

export function createServer(config: MagicMirrorConfig): Server {
  const client = new MagicMirrorClient(config);

  // Collect all tool definitions
  const allToolDefs: ToolDefinition[] = [
    ...moduleTools(client),
    ...monitorTools(client),
    ...alertTools(client),
    ...systemTools(client),
  ] as ToolDefinition[];

  // Build a lookup map by tool name
  const toolMap = new Map<string, ToolDefinition>(
    allToolDefs.map((t) => [t.name, t])
  );

  // Convert tool definitions into MCP Tool descriptors
  const toolDescriptors: Tool[] = allToolDefs.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: zodToJsonSchema(t.inputSchema, { target: "openApi3" }) as Tool["inputSchema"],
  }));

  // Create the MCP server
  const server = new Server(
    {
      name: "magicmirror-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tool listing
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: toolDescriptors,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const toolDef = toolMap.get(toolName);

    if (!toolDef) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ error: `Unknown tool: ${toolName}` }),
          },
        ],
        isError: true,
      };
    }

    try {
      // Validate and parse input
      const input = toolDef.inputSchema.parse(request.params.arguments ?? {});
      const result = await toolDef.handler(input as Record<string, unknown>);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ error: message }),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export async function startServer(config: MagicMirrorConfig): Promise<void> {
  const server = createServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MagicMirror MCP server running on stdio");
}
