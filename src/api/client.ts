import axios, { AxiosInstance } from "axios";

export interface MagicMirrorConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

export interface Module {
  identifier: string;
  name: string;
  position?: string;
  header?: string;
  hidden: boolean;
  lockStrings?: string[];
}

export interface ModuleListResponse {
  success: boolean;
  data: Module[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * HTTP client for the MagicMirror Remote Control API (MMM-Remote-Control)
 * API docs: https://github.com/Jopyth/MMM-Remote-Control
 */
export class MagicMirrorClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: MagicMirrorConfig) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout ?? 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private withApiKey(params: Record<string, string> = {}): Record<string, string> {
    return { ...params, apiKey: this.apiKey };
  }

  /** List all modules and their current status */
  async listModules(): Promise<ModuleListResponse> {
    const response = await this.client.get("/api/module", {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Get detailed info about a specific module by name */
  async getModule(name: string): Promise<ApiResponse<Module[]>> {
    const response = await this.client.get(`/api/module/${encodeURIComponent(name)}`, {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Show a hidden module by its identifier */
  async showModule(identifier: string): Promise<ApiResponse> {
    const response = await this.client.get(
      `/api/module/show/${encodeURIComponent(identifier)}`,
      { params: this.withApiKey() }
    );
    return response.data;
  }

  /** Hide a visible module by its identifier */
  async hideModule(identifier: string): Promise<ApiResponse> {
    const response = await this.client.get(
      `/api/module/hide/${encodeURIComponent(identifier)}`,
      { params: this.withApiKey() }
    );
    return response.data;
  }

  /** Send a custom notification to a module */
  async sendNotification(
    notification: string,
    payload?: Record<string, unknown>
  ): Promise<ApiResponse> {
    const response = await this.client.post(
      `/api/notification/${encodeURIComponent(notification)}`,
      payload ?? {},
      { params: this.withApiKey() }
    );
    return response.data;
  }

  /** Display an alert popup on the mirror */
  async showAlert(
    title: string,
    message: string,
    displayTime?: number
  ): Promise<ApiResponse> {
    const response = await this.client.post(
      "/api/module/alert",
      {
        title,
        message,
        timer: displayTime ?? 4000,
      },
      { params: this.withApiKey() }
    );
    return response.data;
  }

  /** Get the full config.js contents */
  async getMirrorConfig(): Promise<ApiResponse> {
    const response = await this.client.get("/api/config", {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Turn the monitor on */
  async monitorOn(): Promise<ApiResponse> {
    const response = await this.client.get("/api/monitor/on", {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Turn the monitor off */
  async monitorOff(): Promise<ApiResponse> {
    const response = await this.client.get("/api/monitor/off", {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Get the current monitor power status */
  async getMonitorStatus(): Promise<ApiResponse<{ monitor: string }>> {
    const response = await this.client.get("/api/monitor", {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Restart the MagicMirror² process */
  async restartMirror(): Promise<ApiResponse> {
    const response = await this.client.get("/api/restart", {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Shutdown the MagicMirror² Pi */
  async shutdownPi(): Promise<ApiResponse> {
    const response = await this.client.get("/api/shutdown", {
      params: this.withApiKey(),
    });
    return response.data;
  }

  /** Check mirror health by pinging the API */
  async checkHealth(): Promise<{ online: boolean; latencyMs: number; status?: string }> {
    const start = Date.now();
    try {
      const res = await this.listModules();
      const latencyMs = Date.now() - start;
      return {
        online: res.success,
        latencyMs,
        status: res.success ? "online" : "error",
      };
    } catch {
      return {
        online: false,
        latencyMs: Date.now() - start,
        status: "offline",
      };
    }
  }
}
