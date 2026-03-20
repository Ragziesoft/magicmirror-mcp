export class ConnectionManager {

  private online = false
  private lastChecked: Date | null = null

  setOnline(v: boolean) {
    this.online = v
    this.lastChecked = new Date()
  }

  isOnline() {
    return this.online
  }

  getLastChecked() {
    return this.lastChecked
  }

}
