import { z } from "zod";
import { MagicMirrorClient } from "../api/client.js";

export const alertTools = (client: MagicMirrorClient) => [
  {
    name: "show_alert",
    description:
      "Display a popup alert/notification on the MagicMirror screen with a title, message, and optional display duration.",
    inputSchema: z.object({
      title: z.string().describe("Alert title to display on the mirror"),
      message: z.string().describe("Alert body message to display on the mirror"),
      displayTime: z
        .number()
        .optional()
        .describe("How long to show the alert in milliseconds (default: 4000)"),
    }),
    handler: async ({
      title,
      message,
      displayTime,
    }: {
      title: string;
      message: string;
      displayTime?: number;
    }) => {
      const result = await client.showAlert(title, message, displayTime);
      return result.success
        ? { success: true, message: "Alert displayed on mirror." }
        : { success: false, error: result.message ?? "Failed to show alert" };
    },
  },

  {
    name: "send_notification",
    description:
      "Send a notification event to MagicMirror modules. Useful for triggering module-specific actions " +
      "(e.g. PAGE_CHANGED, CALENDAR_EVENTS, custom module notifications).",
    inputSchema: z.object({
      notification: z
        .string()
        .describe("Notification type string, e.g. 'PAGE_CHANGED', 'SHOW_ALERT'"),
      payload: z
        .record(z.unknown())
        .optional()
        .describe("Optional JSON payload to send with the notification"),
    }),
    handler: async ({
      notification,
      payload,
    }: {
      notification: string;
      payload?: Record<string, unknown>;
    }) => {
      const result = await client.sendNotification(notification, payload);
      return result.success
        ? { success: true, message: `Notification '${notification}' sent.` }
        : { success: false, error: result.message ?? "Failed to send notification" };
    },
  },
];
