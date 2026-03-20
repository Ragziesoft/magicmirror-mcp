import { MagicMirrorClient, Module } from "../client/MagicMirrorClient.js"
import { ConnectionManager } from "./connectionManager.js"

export type VisibilityChangeHandler = (module: Module, hidden: boolean) => void
export type ConnectionChangeHandler = (online: boolean) => void

export class MirrorObserver {

  private lastModules: Module[] = []
  private intervalHandle: ReturnType<typeof setInterval> | null = null
  private onVisibilityChange: VisibilityChangeHandler | null = null
  private onConnectionChange: ConnectionChangeHandler | null = null

  constructor(
    private client: MagicMirrorClient,
    private connectionManager: ConnectionManager,
    private pollIntervalMs = 10_000
  ) {}

  onModuleVisibilityChange(handler: VisibilityChangeHandler) {
    this.onVisibilityChange = handler
  }

  onMirrorConnectionChange(handler: ConnectionChangeHandler) {
    this.onConnectionChange = handler
  }

  start() {
    this.intervalHandle = setInterval(() => this.poll(), this.pollIntervalMs)
  }

  stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle)
      this.intervalHandle = null
    }
  }

  async poll() {

    try {

      const response = await this.client.listModules()
      const modules: Module[] = response?.data ?? []

      if (!this.connectionManager.isOnline()) {
        this.connectionManager.setOnline(true)
        this.onConnectionChange?.(true)
      }

      for (const module of modules) {
        const prev = this.lastModules.find(m => m.identifier === module.identifier)
        if (prev && prev.hidden !== module.hidden) {
          this.onVisibilityChange?.(module, module.hidden)
        }
      }

      this.lastModules = modules

    } catch {
      if (this.connectionManager.isOnline()) {
        this.connectionManager.setOnline(false)
        this.onConnectionChange?.(false)
      }
    }

  }

}
