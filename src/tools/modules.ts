import { z } from "zod";
import { MagicMirrorClient } from "../api/client.js";

export const moduleTools = (client: MagicMirrorClient) => [
  {
    name: "list_modules",
    description:
      "List all MagicMirror modules with their current status (name, position, hidden state, identifier). " +
      "Use this first to discover module identifiers before showing/hiding.",
    inputSchema: z.object({}),
    handler: async () => {
      const result = await client.listModules();
      if (!result.success) {
        return { error: "Failed to list modules", raw: result };
      }
      const modules = result.data.map((m) => ({
        identifier: m.identifier,
        name: m.name,
        position: m.position ?? "none",
        hidden: m.hidden,
        header: m.header ?? "",
      }));
      return {
        total: modules.length,
        visible: modules.filter((m) => !m.hidden).length,
        hidden: modules.filter((m) => m.hidden).length,
        modules,
      };
    },
  },

  {
    name: "get_module",
    description: "Get detailed information about a specific MagicMirror module by its name.",
    inputSchema: z.object({
      name: z.string().describe("Module name, e.g. 'calendar', 'MMM-Clock', 'weather'"),
    }),
    handler: async ({ name }: { name: string }) => {
      const result = await client.getModule(name);
      if (!result.success) {
        return { error: `Module '${name}' not found or API error`, raw: result };
      }
      return result;
    },
  },

  {
    name: "show_module",
    description:
      "Show (unhide) a MagicMirror module by its identifier. " +
      "Use list_modules first to get the identifier (e.g. 'module_3_calendar').",
    inputSchema: z.object({
      identifier: z
        .string()
        .describe("Module identifier from list_modules, e.g. 'module_3_calendar'"),
    }),
    handler: async ({ identifier }: { identifier: string }) => {
      const result = await client.showModule(identifier);
      return result.success
        ? { success: true, message: `Module '${identifier}' is now visible.` }
        : { success: false, error: result.message ?? "Failed to show module" };
    },
  },

  {
    name: "hide_module",
    description:
      "Hide a MagicMirror module by its identifier. " +
      "Use list_modules first to get the identifier (e.g. 'module_3_calendar').",
    inputSchema: z.object({
      identifier: z
        .string()
        .describe("Module identifier from list_modules, e.g. 'module_3_calendar'"),
    }),
    handler: async ({ identifier }: { identifier: string }) => {
      const result = await client.hideModule(identifier);
      return result.success
        ? { success: true, message: `Module '${identifier}' is now hidden.` }
        : { success: false, error: result.message ?? "Failed to hide module" };
    },
  },
];
