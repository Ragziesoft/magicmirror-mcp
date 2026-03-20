export class MagicMirrorClient {
    baseUrl;
    apiKey;
    timeout;
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.apiKey = config.apiKey;
        this.timeout = config.timeout ?? 10_000;
    }
    async request(path, options = {}) {
        const separator = path.includes("?") ? "&" : "?";
        const url = `${this.baseUrl}${path}${separator}apiKey=${this.apiKey}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);
        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            if (!res.ok) {
                throw new Error(`MagicMirror HTTP ${res.status}: ${await res.text()}`);
            }
            return await res.json();
        }
        finally {
            clearTimeout(timer);
        }
    }
    async listModules() {
        return this.request("/api/module");
    }
    async showModule(identifier) {
        return this.request(`/api/module/show/${encodeURIComponent(identifier)}`, { method: "GET" });
    }
    async hideModule(identifier) {
        return this.request(`/api/module/hide/${encodeURIComponent(identifier)}`, { method: "GET" });
    }
    async restartMirror() {
        return this.request("/api/restart");
    }
    async shutdownPi() {
        return this.request("/api/shutdown");
    }
    async monitorOn() {
        return this.request("/api/monitor/on");
    }
    async monitorOff() {
        return this.request("/api/monitor/off");
    }
    async monitorStatus() {
        return this.request("/api/monitor");
    }
    async sendNotification(notification, payload) {
        return this.request(`/api/notification/${encodeURIComponent(notification)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload ?? {})
        });
    }
    async health() {
        const start = Date.now();
        try {
            await this.listModules();
            return { online: true, latencyMs: Date.now() - start };
        }
        catch {
            return { online: false, latencyMs: null };
        }
    }
}
