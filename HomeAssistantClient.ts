export interface HomeAssistantConfig {
  baseUrl: string
  token: string
}

export class HomeAssistantClient {

  private baseUrl: string
  private token: string

  constructor(config: HomeAssistantConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "")
    this.token = config.token
  }

  private async request(path: string, options: RequestInit = {}) {

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> ?? {})
      }
    })

    if (!res.ok) {
      throw new Error(`HomeAssistant HTTP ${res.status}: ${await res.text()}`)
    }

    return res.json()

  }

  async getState(entity: string) {
    return this.request(`/api/states/${entity}`)
  }

  async listStates() {
    return this.request(`/api/states`)
  }

  async callService(domain: string, service: string, data: unknown) {
    return this.request(`/api/services/${domain}/${service}`, {
      method: "POST",
      body: JSON.stringify(data)
    })
  }

}
