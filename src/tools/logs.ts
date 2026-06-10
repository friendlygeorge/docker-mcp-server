import Dockerode from "dockerode";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamLogsSchema, ContainerStatsSchema } from "../types.js";
import { formatError, formatBytes } from "../docker.js";

export function registerLogsTools(server: McpServer, docker: Dockerode): void {
  server.tool(
    "stream_logs",
    "Get logs from a Docker container. Supports tail count, timestamp filtering, and follow mode.",
    StreamLogsSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        const logs = await container.logs({
          stdout: true,
          stderr: true,
          tail: params.tail ?? 100,
          since: params.since ? Math.floor(new Date(params.since).getTime() / 1000) : undefined,
          follow: false as const,
        });
        // Dockerode returns a Buffer with multiplexed stream headers
        const output = logs.toString("utf-8").replace(/^[\x00-\x0f]{8}/gm, "");
        return { content: [{ type: "text", text: output || "No logs found." }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "container_stats",
    "Get real-time resource usage statistics for a Docker container (CPU, memory, network, I/O).",
    ContainerStatsSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        const stats = await container.stats({ stream: false });
        
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - (stats.precpu_stats?.cpu_usage?.total_usage ?? 0);
        const systemDelta = stats.cpu_stats.system_cpu_usage - (stats.precpu_stats?.system_cpu_usage ?? 0);
        const cpuCount = stats.cpu_stats.online_cpus ?? 1;
        const cpuPercent = systemDelta > 0 ? (cpuDelta / systemDelta) * cpuCount * 100 : 0;

        const memUsage = stats.memory_stats.usage ?? 0;
        const memLimit = stats.memory_stats.limit ?? 0;
        const memPercent = memLimit > 0 ? (memUsage / memLimit) * 100 : 0;

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: params.container_id,
              cpu: {
                percent: parseFloat(cpuPercent.toFixed(2)),
                cores: cpuCount,
              },
              memory: {
                usage: formatBytes(memUsage),
                limit: formatBytes(memLimit),
                percent: parseFloat(memPercent.toFixed(2)),
              },
              network: stats.networks
                ? Object.fromEntries(
                    Object.entries(stats.networks).map(([iface, data]) => [
                      iface,
                      {
                        rx: formatBytes((data as { rx_bytes?: number }).rx_bytes ?? 0),
                        tx: formatBytes((data as { tx_bytes?: number }).tx_bytes ?? 0),
                      },
                    ])
                  )
                : {},
              blockIO: {
                read: formatBytes((stats.blkio_stats as unknown as { io_service_bytes?: Array<{ value?: number }> })?.io_service_bytes?.[0]?.value ?? 0),
                write: formatBytes((stats.blkio_stats as unknown as { io_service_bytes?: Array<{ value?: number }> })?.io_service_bytes?.[1]?.value ?? 0),
              },
            }, null, 2),
          }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );
}
