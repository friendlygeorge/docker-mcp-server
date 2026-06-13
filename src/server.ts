import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Dockerode from "dockerode";
import { registerContainerTools } from "./tools/container.js";
import { registerImageTools } from "./tools/image.js";
import { registerComposeTools } from "./tools/compose.js";
import { registerHealthTools } from "./tools/health.js";
import { registerLogsTools } from "./tools/logs.js";
import { registerExecTools } from "./tools/exec.js";
import { registerNetworkTools } from "./tools/network.js";
import { registerVolumeTools } from "./tools/volume.js";
import { registerMonitoringTools } from "./tools/monitoring.js";

export function createServer(docker: Dockerode): McpServer {
  const server = new McpServer({
    name: "docker-mcp-server",
    version: "0.3.0",
  });

  // Register all tool categories
  registerContainerTools(server, docker);
  registerImageTools(server, docker);
  registerComposeTools(server);
  registerHealthTools(server, docker);
  registerLogsTools(server, docker);
  registerExecTools(server, docker);
  registerNetworkTools(server, docker);
  registerVolumeTools(server, docker);
  registerMonitoringTools(server, docker);

  return server;
}
