import { z } from "zod";
const haPlugin = {
    name: "homeassistant",
    async register(server, context) {
        const client = context.haClient;
        // ── Entity state ────────────────────────────────────────────────────────
        server.tool("homeassistant.entity.get", "Get the current state and attributes of a Home Assistant entity (e.g. 'light.living_room', 'sensor.temperature')", {
            entity_id: z.string().describe("Home Assistant entity ID, e.g. 'light.living_room' or 'sensor.temperature'")
        }, async ({ entity_id }) => {
            try {
                const result = await client.getState(entity_id);
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error getting entity '${entity_id}': ${err}` }], isError: true };
            }
        });
        // ── Service call ────────────────────────────────────────────────────────
        server.tool("homeassistant.service.call", "Call a Home Assistant service to control devices or trigger automations (e.g. turn lights on/off, lock doors, run scripts)", {
            domain: z.string().describe("Service domain, e.g. 'light', 'switch', 'script', 'automation'"),
            service: z.string().describe("Service name, e.g. 'turn_on', 'turn_off', 'toggle'"),
            data: z.record(z.unknown()).optional().describe("Service data payload, e.g. { entity_id: 'light.living_room', brightness: 128 }")
        }, async ({ domain, service, data }) => {
            try {
                const result = await client.callService(domain, service, data ?? {});
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error calling service '${domain}.${service}': ${err}` }], isError: true };
            }
        });
        // ── Bulk entity state query ─────────────────────────────────────────────
        server.tool("homeassistant.entities.list", "Get the state of multiple Home Assistant entities in a single call", {
            entity_ids: z.array(z.string()).describe("Array of Home Assistant entity IDs to query")
        }, async ({ entity_ids }) => {
            try {
                const results = await Promise.allSettled(entity_ids.map(id => client.getState(id)));
                const output = entity_ids.map((id, i) => {
                    const r = results[i];
                    return r.status === "fulfilled"
                        ? { entity_id: id, ...r.value }
                        : { entity_id: id, error: String(r.reason) };
                });
                return { content: [{ type: "text", text: JSON.stringify(output, null, 2) }] };
            }
            catch (err) {
                return { content: [{ type: "text", text: `Error listing entities: ${err}` }], isError: true };
            }
        });
    }
};
export default haPlugin;
