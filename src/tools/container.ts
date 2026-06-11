import Dockerode from "dockerode";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ListContainersSchema,
  InspectContainerSchema,
  StartContainerSchema,
  StopContainerSchema,
  RestartContainerSchema,
  RemoveContainerSchema,
  RecreateContainerSchema,
  RunContainerSchema,
} from "../types.js";
import { formatContainer, formatError } from "../docker.js";

export function registerContainerTools(server: McpServer, docker: Dockerode): void {
  server.tool(
    "list_containers",
    "List Docker containers with optional filters (state, label, name). Returns container IDs, names, images, states, ports, and labels.",
    ListContainersSchema.shape,
    async (params) => {
      try {
        const containers = await docker.listContainers({
          all: params.all ?? false,
          filters: JSON.stringify({
            ...(params.label ? { label: params.label } : {}),
            ...(params.name ? { name: [`/${params.name}`] } : {}),
            ...(params.state ? { status: [params.state] } : {}),
          }),
        });
        const results = containers.map(formatContainer);
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "inspect_container",
    "Get detailed configuration and state of a Docker container by ID or name.",
    InspectContainerSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        const info = await container.inspect();
        return { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "start_container",
    "Start a stopped Docker container by ID or name.",
    StartContainerSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        await container.start();
        return { content: [{ type: "text", text: `Container ${params.container_id} started.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "stop_container",
    "Stop a running Docker container by ID or name with optional timeout.",
    StopContainerSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        await container.stop({ t: params.timeout ?? 10 });
        return { content: [{ type: "text", text: `Container ${params.container_id} stopped.` }] };
      } catch (error: any) {
        // 304 means container is already stopped — treat as success
        if (error?.statusCode === 304) {
          return { content: [{ type: "text", text: `Container ${params.container_id} was already stopped.` }] };
        }
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "restart_container",
    "Restart a Docker container by ID or name with optional timeout.",
    RestartContainerSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        await container.restart({ t: params.timeout ?? 10 });
        return { content: [{ type: "text", text: `Container ${params.container_id} restarted.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "remove_container",
    "Remove a Docker container by ID or name. Use force to remove running containers.",
    RemoveContainerSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        await container.remove({ force: params.force ?? false });
        return { content: [{ type: "text", text: `Container ${params.container_id} removed.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "recreate_container",
    "Recreate a container with the same configuration (stop, remove, re-create). Useful for applying config changes.",
    RecreateContainerSchema.shape,
    async (params) => {
      try {
        const container = docker.getContainer(params.container_id);
        const info = await container.inspect();
        
        // Stop and remove
        try { await container.stop({ t: params.timeout ?? 10 }); } catch { /* already stopped */ }
        await container.remove({ force: true });

        // Re-create with same config
        const createOpts: Dockerode.ContainerCreateOptions = {
          name: info.Name.replace(/^\//, ""),
          Image: info.Config.Image,
          Env: info.Config.Env,
          Cmd: info.Config.Cmd,
          WorkingDir: info.Config.WorkingDir,
          Labels: info.Config.Labels || {},
          HostConfig: {
            Binds: info.HostConfig?.Binds,
            PortBindings: info.HostConfig?.PortBindings,
            RestartPolicy: info.HostConfig?.RestartPolicy,
            NetworkMode: info.HostConfig?.NetworkMode,
          },
        };

        const newContainer = await docker.createContainer(createOpts);
        await newContainer.start();
        return {
          content: [{ type: "text", text: `Container recreated and started. New ID: ${newContainer.id.substring(0, 12)}` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "run_container",
    "Create and start a new Docker container with one command. Supports image, env, ports, volumes, restart policy, and command override.",
    RunContainerSchema.shape,
    async (params) => {
      try {
        const createOpts: Dockerode.ContainerCreateOptions = {
          Image: params.image,
          name: params.name,
          Env: params.env ? Object.entries(params.env).map(([k, v]) => `${k}=${v}`) : undefined,
          Cmd: params.command,
          ExposedPorts: params.ports
            ? Object.fromEntries(Object.keys(params.ports).map((k) => [k, {}]))
            : undefined,
          HostConfig: {
            PortBindings: params.ports
              ? Object.fromEntries(
                  Object.entries(params.ports).map(([containerPort, hostBinding]) => [
                    containerPort,
                    [{ HostPort: hostBinding }],
                  ])
                )
              : undefined,
            Binds: params.volumes,
            RestartPolicy: params.restart_policy
              ? { Name: params.restart_policy, MaximumRetryCount: 0 }
              : undefined,
          },
        };

        const container = await docker.createContainer(createOpts);
        await container.start();
        return {
          content: [{ type: "text", text: `Container created and started. ID: ${container.id.substring(0, 12)}` }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );
}
