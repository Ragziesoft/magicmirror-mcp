import { z } from "zod";
import { MagicMirrorClient } from "../api/client.js";

export const systemTools = (client: MagicMirrorClient) => [
  {
    name: "check_mirror_health",
    description:
      "Check if the MagicMirror is online and responsive. Returns health status and API latency.",
    inputSchema: z.object({}),
    handler: async () => {
      const health = await client.checkHealth();
      return {
        online: health.online,
        latencyMs: health.latencyMs,
        status: health.status,
        message: health.online
          ? `MagicMirror is online (${health.latencyMs}ms)`
          : "MagicMirror is offline or unreachable",
      };
    },
  },

  {
    name: "get_mirror_config",
    description:
      "Retrieve the current MagicMirror config.js contents. " +
      "Useful for inspecting module settings, positions, and configuration.",
    inputSchema: z.object({}),
    handler: async () => {
      const result = await client.getMirrorConfig();
      return result.success
        ? { success: true, config: result.data }
        : { success: false, error: result.message ?? "Failed to get config" };
    },
  },

  {
    name: "restart_mirror",
    description:
      "Restart the MagicMirror² application. The mirror will briefly go blank and reload. " +
      "Required after config.js changes to apply them.",
    inputSchema: z.object({}),
    handler: async () => {
      const result = await client.restartMirror();
      return result.success
        ? { success: true, message: "MagicMirror is restarting..." }
        : { success: false, error: result.message ?? "Failed to restart mirror" };
    },
  },

  {
    name: "shutdown_pi",
    description:
      "Shut down the Raspberry Pi running MagicMirror. WARNING: This will power off the device. " +
      "Only use when explicitly requested.",
    inputSchema: z.object({
      confirm: z
        .boolean()
        .describe("Must be true to confirm the shutdown operation"),
    }),
    handler: async ({ confirm }: { confirm: boolean }) => {
      if (!confirm) {
        return { success: false, error: "Shutdown cancelled — confirm must be true." };
      }
      const result = await client.shutdownPi();
      return result.success
        ? { success: true, message: "Raspberry Pi is shutting down..." }
        : { success: false, error: result.message ?? "Failed to shutdown Pi" };
    },
  },
];
