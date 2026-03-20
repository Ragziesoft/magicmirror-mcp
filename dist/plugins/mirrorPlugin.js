import { z } from "zod";
const mirrorPlugin = {
    name: "mirror",
    async register(server, context) {
        const client = context.mirrorClient;
        // ── Module listing ──────────────────────────────────────────────────────
        server.tool("mirror.module.list", "List all modules installed on the MagicMirror, including their identifiers and current visibility state", {}, async () => {
            try {
                const result = await client.listModules();
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error listing modules: ${err}` }], isError: true };
            }
        });
        // ── Module show / hide ──────────────────────────────────────────────────
        server.tool("mirror.module.show", "Show a hidden MagicMirror module by its identifier (e.g. 'clock', 'MMM-Weather')", { identifier: z.string().describe("Module identifier as returned by mirror.module.list") }, async ({ identifier }) => {
            try {
                const result = await client.showModule(identifier);
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error showing module '${identifier}': ${err}` }], isError: true };
            }
        });
        server.tool("mirror.module.hide", "Hide a visible MagicMirror module by its identifier (e.g. 'clock', 'MMM-Weather')", { identifier: z.string().describe("Module identifier as returned by mirror.module.list") }, async ({ identifier }) => {
            try {
                const result = await client.hideModule(identifier);
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error hiding module '${identifier}': ${err}` }], isError: true };
            }
        });
        // ── Monitor control ─────────────────────────────────────────────────────
        server.tool("mirror.monitor.on", "Turn the MagicMirror display on", {}, async () => {
            try {
                const result = await client.monitorOn();
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error turning monitor on: ${err}` }], isError: true };
            }
        });
        server.tool("mirror.monitor.off", "Turn the MagicMirror display off", {}, async () => {
            try {
                const result = await client.monitorOff();
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error turning monitor off: ${err}` }], isError: true };
            }
        });
        server.tool("mirror.monitor.status", "Get the current power state of the MagicMirror display (on or off)", {}, async () => {
            try {
                const result = await client.monitorStatus();
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error getting monitor status: ${err}` }], isError: true };
            }
        });
        // ── System control ──────────────────────────────────────────────────────
        server.tool("mirror.restart", "Restart the MagicMirror application", {}, async () => {
            try {
                const result = await client.restartMirror();
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error restarting mirror: ${err}` }], isError: true };
            }
        });
        // ── Health ──────────────────────────────────────────────────────────────
        server.tool("mirror.health", "Check whether the MagicMirror is reachable and measure API response latency", {}, async () => {
            try {
                const result = await client.health();
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: JSON.stringify({ online: false, error: String(err) }) }] };
            }
        });
    }
};
export default mirrorPlugin;
