export class HomeAssistantClient {
    baseUrl;
    token;
    constructor(config) {
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.token = config.token;
    }
    async request(path, options = {}) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                ...(options.headers ?? {})
            }
        });
        if (!res.ok) {
            throw new Error(`HomeAssistant HTTP ${res.status}: ${await res.text()}`);
        }
        return res.json();
    }
    async getState(entity) {
        return this.request(`/api/states/${entity}`);
    }
    async listStates() {
        return this.request(`/api/states`);
    }
    async callService(domain, service, data) {
        return this.request(`/api/services/${domain}/${service}`, {
            method: "POST",
            body: JSON.stringify(data)
        });
    }
}
