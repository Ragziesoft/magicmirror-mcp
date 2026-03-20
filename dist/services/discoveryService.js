export class DiscoveryService {
    mirrorClient;
    haClient;
    constructor(mirrorClient, haClient) {
        this.mirrorClient = mirrorClient;
        this.haClient = haClient;
    }
    async discover() {
        const [mirrorResult, haResult] = await Promise.allSettled([
            this.mirrorClient.listModules(),
            this.haClient.listStates()
        ]);
        const mirrorModules = mirrorResult.status === "fulfilled" && mirrorResult.value?.data
            ? mirrorResult.value.data
            : [];
        const haEntityIds = haResult.status === "fulfilled" && Array.isArray(haResult.value)
            ? haResult.value.map((e) => e.entity_id)
            : [];
        return {
            mirror: {
                available: mirrorResult.status === "fulfilled",
                modules: mirrorModules
            },
            homeAssistant: {
                available: haResult.status === "fulfilled",
                entityIds: haEntityIds
            }
        };
    }
}
