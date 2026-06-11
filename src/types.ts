import { z } from "zod";

// Container lifecycle schemas
export const ListContainersSchema = z.object({
  all: z.boolean().optional().describe("Include stopped containers (default: false)"),
  label: z.array(z.string()).optional().describe("Filter by label (e.g., 'app=web')"),
  name: z.string().optional().describe("Filter by name (partial match)"),
  state: z.enum(["running", "stopped", "paused", "exited", "created", "restarting"]).optional().describe("Filter by state"),
});

export const InspectContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
});

export const StartContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
});

export const StopContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  timeout: z.number().optional().describe("Seconds to wait before killing (default: 10)"),
});

export const RestartContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  timeout: z.number().optional().describe("Seconds to wait before killing (default: 10)"),
});

export const RemoveContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  force: z.boolean().optional().describe("Force removal even if running (default: false)"),
});

export const RecreateContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  timeout: z.number().optional().describe("Seconds to wait before killing (default: 10)"),
});

export const RunContainerSchema = z.object({
  image: z.string().describe("Image name (e.g., 'nginx:latest')"),
  name: z.string().optional().describe("Container name"),
  env: z.record(z.string()).optional().describe("Environment variables"),
  ports: z.record(z.string()).optional().describe("Port mappings (e.g., {'8080/tcp': '80/tcp'})"),
  volumes: z.array(z.string()).optional().describe("Volume mounts (e.g., ['/host/path:/container/path'])"),
  restart_policy: z.enum(["no", "always", "unless-stopped", "on-failure"]).optional().describe("Restart policy"),
  command: z.array(z.string()).optional().describe("Override command"),
  detach: z.boolean().optional().describe("Run in detached mode (default: true)"),
});

// Image management schemas
export const ListImagesSchema = z.object({
  all: z.boolean().optional().describe("Include intermediate images (default: false)"),
  filter: z.string().optional().describe("Filter by reference"),
});

export const PullImageSchema = z.object({
  image: z.string().describe("Image to pull (e.g., 'nginx:latest')"),
  tag: z.string().optional().describe("Tag to pull (default: 'latest')"),
});

export const BuildImageSchema = z.object({
  context: z.string().describe("Build context path or Dockerfile content"),
  tag: z.string().describe("Tag for the built image (e.g., 'myapp:v1')"),
  dockerfile: z.string().optional().describe("Dockerfile name relative to context (default: 'Dockerfile')"),
  build_args: z.record(z.string()).optional().describe("Build arguments"),
  target: z.string().optional().describe("Target build stage"),
});

export const RemoveImageSchema = z.object({
  image: z.string().describe("Image name or ID"),
  force: z.boolean().optional().describe("Force removal (default: false)"),
});

// Docker Compose schemas
export const ComposeUpSchema = z.object({
  path: z.string().describe("Path to docker-compose.yml file or its parent directory"),
  build: z.boolean().optional().describe("Build images before starting (default: false)"),
  detach: z.boolean().optional().describe("Run in detached mode (default: true)"),
  services: z.array(z.string()).optional().describe("Specific services to start"),
});

export const ComposeDownSchema = z.object({
  path: z.string().describe("Path to docker-compose.yml file or its parent directory"),
  volumes: z.boolean().optional().describe("Remove named volumes (default: false)"),
  timeout: z.number().optional().describe("Shutdown timeout in seconds (default: 10)"),
});

export const ComposePsSchema = z.object({
  path: z.string().describe("Path to docker-compose.yml file or its parent directory"),
});

export const ComposeLogsSchema = z.object({
  path: z.string().describe("Path to docker-compose.yml directory"),
  services: z.array(z.string()).optional().describe("Specific services to tail"),
  tail: z.number().optional().describe("Number of lines to show (default: 100)"),
  follow: z.boolean().optional().describe("Follow log output (default: false)"),
});

export const ComposeRestartSchema = z.object({
  path: z.string().describe("Path to docker-compose.yml file or its parent directory"),
  services: z.array(z.string()).optional().describe("Specific services to restart (empty = all)"),
  timeout: z.number().optional().describe("Shutdown timeout in seconds (default: 10)"),
});

// Health schemas
export const CheckHealthSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  type: z.enum(["http", "tcp", "exec"]).optional().describe("Probe type (default: auto-detect from HEALTHCHECK)"),
  endpoint: z.string().optional().describe("HTTP endpoint or TCP port"),
  command: z.array(z.string()).optional().describe("Command for exec probe"),
});

export const WatchHealthSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  timeout: z.number().optional().describe("Max seconds to wait (default: 60)"),
  interval: z.number().optional().describe("Seconds between polls (default: 5)"),
});

export const SetRestartPolicySchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  policy: z.enum(["no", "always", "unless-stopped", "on-failure"]).describe("Restart policy"),
  max_retry_count: z.number().optional().describe("Max retry count for on-failure (default: 0)"),
});

// Logs schemas
export const StreamLogsSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  tail: z.number().optional().describe("Number of lines to show (default: 100)"),
  since: z.string().optional().describe("Show logs since timestamp (e.g., '2026-01-01T00:00:00Z')"),
  follow: z.boolean().optional().describe("Follow log output (default: false)"),
});

export const ContainerStatsSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
});

// Exec schema
export const ExecInContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  command: z.array(z.string()).describe("Command to execute"),
  working_dir: z.string().optional().describe("Working directory inside container"),
  env: z.record(z.string()).optional().describe("Environment variables"),
});

// Network/Volume schemas
export const ListNetworksSchema = z.object({
  filter: z.string().optional().describe("Filter by name or driver"),
});

export const ListVolumesSchema = z.object({
  filter: z.string().optional().describe("Filter by name or driver"),
});
