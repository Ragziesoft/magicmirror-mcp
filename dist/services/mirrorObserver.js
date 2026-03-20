export class MirrorObserver {
    client;
    connectionManager;
    pollIntervalMs;
    lastModules = [];
    intervalHandle = null;
    onVisibilityChange = null;
    onConnectionChange = null;
    constructor(client, connectionManager, pollIntervalMs = 10_000) {
        this.client = client;
        this.connectionManager = connectionManager;
        this.pollIntervalMs = pollIntervalMs;
    }
    onModuleVisibilityChange(handler) {
        this.onVisibilityChange = handler;
    }
    onMirrorConnectionChange(handler) {
        this.onConnectionChange = handler;
    }
    start() {
        this.intervalHandle = setInterval(() => this.poll(), this.pollIntervalMs);
    }
    stop() {
        if (this.intervalHandle) {
            clearInterval(this.intervalHandle);
            this.intervalHandle = null;
        }
    }
    async poll() {
        try {
            const response = await this.client.listModules();
            const modules = response?.data ?? [];
            if (!this.connectionManager.isOnline()) {
                this.connectionManager.setOnline(true);
                this.onConnectionChange?.(true);
            }
            for (const module of modules) {
                const prev = this.lastModules.find(m => m.identifier === module.identifier);
                if (prev && prev.hidden !== module.hidden) {
                    this.onVisibilityChange?.(module, module.hidden);
                }
            }
            this.lastModules = modules;
        }
        catch {
            if (this.connectionManager.isOnline()) {
                this.connectionManager.setOnline(false);
                this.onConnectionChange?.(false);
            }
        }
    }
}
