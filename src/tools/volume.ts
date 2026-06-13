import Dockerode from "dockerode";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CreateVolumeSchema,
  InspectVolumeSchema,
  RemoveVolumeSchema,
  PruneVolumesSchema,
} from "../types.js";
import { formatError, withRetry } from "../docker.js";

export function registerVolumeTools(server: McpServer, docker: Dockerode): void {
  server.tool(
    "create_volume",
    "Create a Docker volume with optional driver, labels, and options. Returns volume name, driver, and mountpoint.",
    CreateVolumeSchema.shape,
    { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    async (params) => {
      try {
        const result = await withRetry(() => docker.createVolume({
          Name: params.name,
          Driver: params.driver || "local",
          Labels: params.labels,
          DriverOpts: params.options,
        }), { label: "create_volume" });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: result.Name,
              driver: result.Driver,
              mountpoint: result.Mountpoint,
              created: result.CreatedAt,
              labels: result.Labels,
            }, null, 2),
          }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "inspect_volume",
    "Inspect a Docker volume. Returns detailed info including name, driver, mountpoint, labels, scope, and usage data.",
    InspectVolumeSchema.shape,
    { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    async (params) => {
      try {
        const volume = docker.getVolume(params.name);
        const info = await volume.inspect();
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              name: info.Name,
              driver: info.Driver,
              mountpoint: info.Mountpoint,
              labels: info.Labels,
              scope: info.Scope,
              options: info.Options,
              status: info.Status || null,
              usage: info.UsageData || null,
            }, null, 2),
          }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "remove_volume",
    "Remove a Docker volume. Use force=true to remove even if in use by containers.",
    RemoveVolumeSchema.shape,
    { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    async (params) => {
      try {
        const volume = docker.getVolume(params.name);
        await volume.remove({ force: params.force || false });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ success: true, name: params.name, message: `Volume '${params.name}' removed` }),
          }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "prune_volumes",
    "Remove all unused Docker volumes. Returns count of removed volumes and reclaimed space.",
    PruneVolumesSchema.shape,
    { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false },
    async (params) => {
      try {
        const filters: Record<string, string[]> = {};
        if (params.filter) {
          const match = params.filter.match(/label=(.+)/);
          if (match) {
            filters.label = [match[1]];
          }
        }
        const result = await docker.pruneVolumes({
          filters: Object.keys(filters).length > 0 ? filters : undefined,
        });
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              volumes_deleted: result.VolumesDeleted || [],
              space_reclaimed: result.SpaceReclaimed || 0,
            }, null, 2),
          }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );
}