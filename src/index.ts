#!/usr/bin/env node

/**
 * MagicMirror MCP Server
 *
 * Exposes MagicMirror² control capabilities via the Model Context Protocol (MCP),
 * enabling AI assistants like Claude to interact with your smart mirror.
 *
 * Requirements:
 *   - MagicMirror² running with MMM-Remote-Control installed and configured
 *   - MAGICMIRROR_URL environment variable set (e.g. http://192.168.1.100:8080)
 *   - MAGICMIRROR_API_KEY environment variable set (your MMM-Remote-Control API key)
 *
 * Usage:
 *   MAGICMIRROR_URL=http://192.168.1.100:8080 \
 *   MAGICMIRROR_API_KEY=your_key \
 *   node dist/index.js
 */

import { startServer } from "./server.js";

const baseUrl = process.env.MAGICMIRROR_URL;
const apiKey = process.env.MAGICMIRROR_API_KEY;

if (!baseUrl) {
  console.error("Error: MAGICMIRROR_URL environment variable is required.");
  console.error("  Example: http://192.168.1.100:8080");
  process.exit(1);
}

if (!apiKey) {
  console.error("Error: MAGICMIRROR_API_KEY environment variable is required.");
  console.error("  Set this to the apiKey value from your MMM-Remote-Control config.");
  process.exit(1);
}

startServer({ baseUrl, apiKey }).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
