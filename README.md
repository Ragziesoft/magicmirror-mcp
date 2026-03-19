# magicmirror-mcp

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for controlling [MagicMirror](https://magicmirror.builders/) via the [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control) API.

This lets AI assistants like **Claude** interact with your smart mirror.

---

## Features

| Tool | Description |
|---|---|
| `list_modules` | List all modules with their current visibility and identifiers |
| `get_module` | Get detailed info about a specific module |
| `show_module` | Make a hidden module visible |
| `hide_module` | Hide a visible module |
| `get_monitor_status` | Check if the display is on or off |
| `monitor_on` | Turn the display on |
| `monitor_off` | Turn the display off |
| `show_alert` | Display a popup alert on the mirror |
| `send_notification` | Send a notification event to modules |
| `check_mirror_health` | Ping the mirror and check response latency |
| `get_mirror_config` | Retrieve the full config.js contents |
| `restart_mirror` | Restart the MagicMirror application |
| `shutdown_pi` | Shut down the Raspberry Pi (with confirmation) |

---

## Prerequisites

1. **MagicMirror** installed and running on your Raspberry Pi
2. **MMM-Remote-Control** module installed and configured in your `config.js`
3. **Node.js 18+** on the machine running the MCP server

---

## Installation

```bash
git clone https://github.com/Ragziesoft/magicmirror-mcp.git
cd magicmirror-mcp
npm install
npm run build
```

---

## Configuration

```env
MAGICMIRROR_URL=http://192.168.1.100:8080
MAGICMIRROR_API_KEY=your_api_key_here
```

---

## Claude Desktop Integration

```json
{
  "mcpServers": {
    "magicmirror": {
      "command": "node",
      "args": ["/path/to/magicmirror-mcp/dist/index.js"],
      "env": {
        "MAGICMIRROR_URL": "http://192.168.1.100:8080",
        "MAGICMIRROR_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

---

## Project Structure

```
src/
├── index.ts
├── server.ts
├── api/
│   └── client.ts
└── tools/
    ├── modules.ts
    ├── monitor.ts
    ├── alerts.ts
    └── system.ts
```

---

## License

MIT (c) Ragziesoft
