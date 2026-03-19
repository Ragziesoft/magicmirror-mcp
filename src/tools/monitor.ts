import { z } from "zod";
import { MagicMirrorClient } from "../api/client.js";

export const monitorTools = (client: MagicMirrorClient) => [
  {
    name: "get_monitor_status",
    description: "Check whether the MagicMirror display (monitor) is currently on or off.",
    inputSchema: z.object({}),
    handler: async () => {
      const result = await client.getMonitorStatus();
      return result.success
        ? { success: true, monitor: result.data?.monitor ?? "unknown" }
        : { success: false, error: "Failed to get monitor status" };
    },
  },

  {
    name: "monitor_on",
    description: "Turn the MagicMirror display (monitor) ON.",
    inputSchema: z.object({}),
    handler: async () => {
      const result = await client.monitorOn();
      return result.success
        ? { success: true, message: "Monitor turned ON." }
        : { success: false, error: result.message ?? "Failed to turn monitor on" };
    },
  },

  {
    name: "monitor_off",
    description: "Turn the MagicMirror display (monitor) OFF.",
    inputSchema: z.object({}),
    handler: async () => {
      const result = await client.monitorOff();
      return result.success
        ? { success: true, message: "Monitor turned OFF." }
        : { success: false, error: result.message ?? "Failed to turn monitor off" };
    },
  },
];
