import { z } from "zod"
import { MCPPlugin } from "./plugin.js"

const notificationsPlugin: MCPPlugin = {

  name: "notifications",

  async register(server, context) {

    const client = context.mirrorClient

    server.tool(
      "mirror.notification.send",
      "Send a MagicMirror notification to trigger module behaviour. Use 'SHOW_ALERT' to display a popup, or any module-specific notification string.",
      {
        notification: z.string().describe("Notification name (e.g. 'SHOW_ALERT', 'HIDE_ALERT', 'CLOCK_SECOND')"),
        payload: z.record(z.unknown()).optional().describe("Optional payload object passed with the notification")
      },
      async ({ notification, payload }) => {
        try {
          const result = await client.sendNotification(notification, payload ?? {})
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
        } catch (err) {
          return { content: [{ type: "text", text: `Error sending notification '${notification}': ${err}` }], isError: true }
        }
      }
    )

    server.tool(
      "mirror.alert.show",
      "Display an alert popup on the MagicMirror screen with a title and message",
      {
        title: z.string().describe("Alert title shown on the mirror"),
        message: z.string().describe("Alert body text"),
        timer: z.number().optional().describe("Auto-dismiss time in milliseconds (omit to keep until dismissed)")
      },
      async ({ title, message, timer }) => {
        try {
          const payload: Record<string, unknown> = { title, message }
          if (timer !== undefined) payload.timer = timer
          const result = await client.sendNotification("SHOW_ALERT", payload)
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
        } catch (err) {
          return { content: [{ type: "text", text: `Error showing alert: ${err}` }], isError: true }
        }
      }
    )

    server.tool(
      "mirror.alert.hide",
      "Dismiss the currently displayed alert popup on the MagicMirror",
      {},
      async () => {
        try {
          const result = await client.sendNotification("HIDE_ALERT", {})
          return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
        } catch (err) {
          return { content: [{ type: "text", text: `Error hiding alert: ${err}` }], isError: true }
        }
      }
    )

  }

}

export default notificationsPlugin
