import { z } from "zod";

// Validation regexes (shared across schemas)
const SAFE_CMD_ARG = /^[A-Za-z0-9_./:@%+=,\-]+$/;
const SAFE_PATH = /^\/[A-Za-z0-9_./\-]+$/;
const SAFE_ENV_KEY = /^[A-Z_][A-Z0-9_]*$/;
const SAFE_BUILD_CONTEXT = /^\/[A-Za-z0-9_./\-]+$/;

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
  context: z.string().regex(SAFE_BUILD_CONTEXT, "Build context must be a local absolute path (no URLs, no '..')")
    .max(4096).describe("Build context path (local absolute path only)"),
  tag: z.string().describe("Tag for the built image (e.g., 'myapp:v1')"),
  dockerfile: z.string().max(256).optional().describe("Dockerfile name relative to context (default: 'Dockerfile')"),
  build_args: z.record(
    z.string().regex(SAFE_ENV_KEY, "Build arg key must be POSIX-style").max(256),
    z.string().max(4096)
  ).optional().describe("Build arguments (keys must be POSIX-style)"),
  target: z.string().max(256).optional().describe("Target build stage"),
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
  timeout: z.number().max(600).optional().describe("Max seconds to wait (default: 60, max: 600)"),
  interval: z.number().max(60).optional().describe("Seconds between polls (default: 5, max: 60)"),
});

export const SetRestartPolicySchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  policy: z.enum(["no", "always", "unless-stopped", "on-failure"]).describe("Restart policy"),
  max_retry_count: z.number().optional().describe("Max retry count for on-failure (default: 0)"),
});

// Logs schemas
export const StreamLogsSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  tail: z.number().max(10000).optional().describe("Number of lines to show (default: 100, max: 10000)"),
  since: z.string().optional().describe("Show logs since timestamp (e.g., '2026-01-01T00:00:00Z')"),
  follow: z.boolean().optional().describe("Follow log output (default: false)"),
});

export const ContainerStatsSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
});

// Exec schema (validated per Finding 8.1 — command/working_dir/env constraints)
export const ExecInContainerSchema = z.object({
  container_id: z.string().describe("Container ID or name"),
  command: z.array(z.string().max(500).regex(SAFE_CMD_ARG, "Command arg contains disallowed characters"))
    .min(1).max(50).describe("Command to execute (max 50 args, alphanumeric + safe chars only)"),
  working_dir: z.string().regex(SAFE_PATH, "Working directory must be an absolute path without '..'")
    .max(1000).optional().describe("Working directory inside container (absolute path)"),
  env: z.record(
    z.string().regex(SAFE_ENV_KEY, "Env key must be POSIX-style (A-Z, 0-9, _)").max(100),
    z.string().max(1000)
  ).optional().describe("Environment variables (keys must be POSIX-style)"),
});

// Network/Volume schemas
export const ListNetworksSchema = z.object({
  filter: z.string().optional().describe("Filter by name or driver"),
});

export const ListVolumesSchema = z.object({
  filter: z.string().optional().describe("Filter by name or driver"),
});


// Monitoring schemas (v0.2.0)
export const ContainerHealthStatusSchema = z.object({});

export const ContainerResourceUsageSchema = z.object({
  sort_by: z.enum(["cpu", "memory", "network"]).optional().describe("Sort results by metric (default: cpu)"),
});

export const WatchEventsSchema = z.object({
  container: z.string().optional().describe("Filter by container name or ID"),
  event_type: z.enum(["start", "stop", "die", "restart", "health_status", "oom", "all"]).optional().describe("Filter by event type (default: all)"),
  since: z.string().optional().describe("Show events since timestamp (e.g., '2026-01-01T00:00:00Z')"),
  duration: z.number().max(300).optional().describe("Max seconds to listen (default: 30, max: 300)"),
});

export const SearchLogsSchema = z.object({
  pattern: z.string().max(1000).describe("Regex or grep pattern to search for"),
  containers: z.array(z.string()).max(50).optional().describe("Specific containers to search (default: all running, max: 50)"),
  tail: z.number().max(10000).optional().describe("Max lines to scan per container (default: 500, max: 10000)"),
  since: z.string().optional().describe("Only search logs since timestamp"),
  ignore_case: z.boolean().optional().describe("Case-insensitive search (default: false)"),
});

export const ResourceAlertCheckSchema = z.object({
  cpu_percent: z.number().optional().describe("Alert if CPU usage exceeds this % (default: 80)"),
  memory_percent: z.number().optional().describe("Alert if memory usage exceeds this % (default: 80)"),
  restart_count: z.number().optional().describe("Alert if restart count exceeds this (default: 5)"),
});

export const MonitorDashboardSchema = z.object({});