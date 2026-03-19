# magicmirror-mcp

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for controlling [MagicMirror²](https://magicmirror.builders/) via the [MMM-Remote-Control](https://github.com/Jopyth/MMM-Remote-Control) API.

This lets AI assistants like **Claude** interact with your smart mirror — showing/hiding modules, sending alerts, toggling the display, restarting the mirror, and more.

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
| `restart_mirror` | Restart the MagicMirror² application |
| `shutdown_pi` | Shut down the Raspberry Pi (with confirmation) |

---

## Prerequisites

1. **MagicMirror²** installed and running on your Raspberry Pi
2. **MMM-Remote-Control** module installed and configured in your `config.js`:

```js
{
  module: "MMM-Remote-Control",
  config: {
    apiKey: "your_api_key_here",
    secureEndpoints: true
  }
}
```

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

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MAGICMIRROR_URL=http://192.168.1.100:8080
MAGICMIRROR_API_KEY=your_api_key_here
```

- `MAGICMIRROR_URL` — the URL/IP of your MagicMirror Pi on the local network
- `MAGICMIRROR_API_KEY` — the `apiKey` you set in MMM-Remote-Control's config

---

## Running

```bash
# Using environment variables directly
MAGICMIRROR_URL=http://192.168.1.100:8080 \
MAGICMIRROR_API_KEY=your_key \
node dist/index.js

# Or with a .env file (requires dotenv-cli)
npx dotenv -e .env -- node dist/index.js
```

---

## Claude Desktop Integration

Add this to your Claude Desktop MCP config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

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

After saving, restart Claude Desktop. You can now ask Claude things like:
- *"What modules are running on my mirror?"*
- *"Hide the clock module"*
- *"Show an alert saying 'Dinner is ready!'"*
- *"Turn off the mirror display"*

---

## Claude Code Integration

```bash
claude mcp add magicmirror \
  -e MAGICMIRROR_URL=http://192.168.1.100:8080 \
  -e MAGICMIRROR_API_KEY=your_key \
  -- node /path/to/magicmirror-mcp/dist/index.js
```

---

## Development

```bash
# Run in development mode (no build step)
npm run dev

# Build TypeScript
npm run build

# Lint
npm run lint
```

---

## Project Structure

```
src/
├── index.ts          # Entry point — reads env vars, starts server
├── server.ts         # MCP server setup, tool registration, request handlers
├── api/
│   └── client.ts     # Axios HTTP client for MMM-Remote-Control API
└── tools/
    ├── modules.ts    # list_modules, get_module, show_module, hide_module
    ├── monitor.ts    # get_monitor_status, monitor_on, monitor_off
    ├── alerts.ts     # show_alert, send_notification
    └── system.ts     # check_mirror_health, get_mirror_config, restart_mirror, shutdown_pi
```

---

## License

MIT © [Ragziesoft](https://github.com/Ragziesoft)
