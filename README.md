# MagicMirror MCP Server

A **Model Context Protocol (MCP) server** that lets AI agents control a [MagicMirror²](https://magicmirror.builders/) installation and optionally integrate with [Home Assistant](https://www.home-assistant.io/).

Built with the official [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and designed to run alongside MagicMirror using [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control).

---

## Features

- **Module control** — list, show, and hide any installed MagicMirror module
- **Monitor control** — turn the display on/off and query its power state
- **Notifications & alerts** — send notifications or display alert popups on the mirror
- **Mirror health** — check connectivity and measure API latency
- **Home Assistant integration** — get entity states, call services, bulk-query entities
- **System discovery** — query installed modules and HA entities in a single call
- **Plugin architecture** — add new tools without touching core code

---

## MCP Tools

| Tool | Description |
|---|---|
| `mirror.module.list` | List all installed modules and their visibility state |
| `mirror.module.show` | Show a hidden module by identifier |
| `mirror.module.hide` | Hide a visible module by identifier |
| `mirror.monitor.on` | Turn the display on |
| `mirror.monitor.off` | Turn the display off |
| `mirror.monitor.status` | Get current monitor power state |
| `mirror.restart` | Restart the MagicMirror application |
| `mirror.health` | Check if the mirror is reachable and measure latency |
| `mirror.notification.send` | Send any MagicMirror notification with optional payload |
| `mirror.alert.show` | Display an alert popup (title + message + optional timer) |
| `mirror.alert.hide` | Dismiss the current alert popup |
| `homeassistant.entity.get` | Get state and attributes of a single HA entity |
| `homeassistant.entities.list` | Bulk-get the state of multiple HA entities |
| `homeassistant.service.call` | Call any Home Assistant service |
| `system.schema` | Discover all available modules and HA entities |

---

## Architecture

```
AI Agent (Claude, etc.)
        │
        ▼
  MCP Server (stdio)
        │
   ┌────┴─────────────────┐
   │                      │
MagicMirror²        Home Assistant
(MMM-Remote-Control)   (REST API)
```

```
src/
├── server.ts                  ← Entry point, MCP server init
├── pluginLoader.ts            ← Loads all plugins at startup
├── client/
│   ├── MagicMirrorClient.ts   ← HTTP client for MMM-Remote-Control
│   └── HomeAssistantClient.ts ← HTTP client for Home Assistant REST API
├── plugins/
│   ├── plugin.ts              ← MCPPlugin interface
│   ├── mirrorPlugin.ts        ← Module, monitor, health, and restart tools
│   ├── notificationsPlugin.ts ← Notification and alert tools
│   ├── homeAssistantPlugin.ts ← Home Assistant entity and service tools
│   └── systemPlugin.ts        ← System discovery tool
└── services/
    ├── connectionManager.ts   ← Online/offline state tracking
    ├── discoveryService.ts    ← Queries modules and HA entities
    ├── mirrorObserver.ts      ← Polls mirror for visibility changes
    └── schemaGenerator.ts     ← Builds system capability snapshot
```

---

## Requirements

- Node.js **18+**
- MagicMirror² with [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control) installed

**Optional:**

- Home Assistant for smart home integration

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

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# MagicMirror connection (required)
MAGICMIRROR_URL=http://mirror.local:8080
MAGICMIRROR_API_KEY=your_api_key

# Home Assistant (optional)
HOMEASSISTANT_URL=http://homeassistant.local:8123
HOMEASSISTANT_TOKEN=your_long_lived_token
```

The API key is configured in MMM-Remote-Control's module settings in your MagicMirror `config.js`.

---

## Running

```bash
npm start
```

The server communicates over **stdio** and is designed to be launched by an MCP client (e.g. Claude Desktop, Claude Code).

### Claude Desktop config example

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "magicmirror": {
      "command": "node",
      "args": ["/path/to/magicmirror-mcp/dist/server.js"],
      "env": {
        "MAGICMIRROR_URL": "http://mirror.local:8080",
        "MAGICMIRROR_API_KEY": "your_api_key",
        "HOMEASSISTANT_URL": "http://homeassistant.local:8123",
        "HOMEASSISTANT_TOKEN": "your_token"
      }
    }
  }
}
```

---

## Example AI interactions

- *"Show the weather module"* → `mirror.module.show`
- *"Turn off the display at bedtime"* → `mirror.monitor.off`
- *"Display a reminder: Dinner at 7pm"* → `mirror.alert.show`
- *"Is the mirror online?"* → `mirror.health`
- *"Turn on the living room lights"* → `homeassistant.service.call`
- *"What modules are installed?"* → `mirror.module.list`
- *"What can you control?"* → `system.schema`

---

## Extending with plugins

Create a new file in `src/plugins/` implementing `MCPPlugin`:

```typescript
import { z } from "zod"
import { MCPPlugin } from "./plugin.js"

const myPlugin: MCPPlugin = {
  name: "my-plugin",
  async register(server, context) {
    server.tool(
      "my.tool",
      "Description of what this tool does",
      { param: z.string().describe("A parameter") },
      async ({ param }) => {
        return { content: [{ type: "text", text: `Result: ${param}` }] }
      }
    )
  }
}

export default myPlugin
```

Then add it to `src/pluginLoader.ts`.

---

## Roadmap

- WebSocket support for real-time mirror event streaming
- Raspberry Pi shutdown tool
- MagicMirror configuration file editing
- Camera stream integration
- Additional plugin ecosystem

---

## License

MIT @ Ragzie
