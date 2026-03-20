export class ConnectionManager {
    online = false;
    lastChecked = null;
    setOnline(v) {
        this.online = v;
        this.lastChecked = new Date();
    }
    isOnline() {
        return this.online;
    }
    getLastChecked() {
        return this.lastChecked;
    }
}
