#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createDockerClient } from "./docker.js";
import { createServer } from "./server.js";

async function main() {
  const docker = createDockerClient();
  const server = createServer(docker);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.stderr.write("Docker MCP Server running on stdio\n");
}

main().catch((error) => {
  process.stderr.write(`Fatal error: ${error}\n`);
  process.exit(1);
});
