import Dockerode from "dockerode";

export interface DockerClientOptions {
  socketPath?: string;
  host?: string;
  port?: number;
}

export function createDockerClient(options?: DockerClientOptions): Dockerode {
  if (options?.socketPath) {
    return new Dockerode({ socketPath: options.socketPath });
  }
  if (options?.host && options?.port) {
    return new Dockerode({ host: options.host, port: options.port });
  }
  // Default: local socket
  return new Dockerode({ socketPath: "/var/run/docker.sock" });
}

/**
 * Structured error types for programmatic error classification.
 * Helps AI clients decide whether to retry (retryable) or report (permanent).
 */
export class DockerConnectionError extends Error {
  retryable = false;
  constructor(message: string) {
    super(message);
    this.name = "DockerConnectionError";
  }
}

export class DockerTimeoutError extends Error {
  retryable = true;
  constructor(message: string) {
    super(message);
    this.name = "DockerTimeoutError";
  }
}

export class DockerPermissionError extends Error {
  retryable = false;
  constructor(message: string) {
    super(message);
    this.name = "DockerPermissionError";
  }
}

/**
 * Check Docker daemon connectivity at startup.
 * Returns a structured error if Docker is unreachable.
 */
export async function checkDockerConnection(
  docker: Dockerode
): Promise<{ ok: boolean; error?: string }> {
  try {
    await docker.ping();
    return { ok: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("EACCES") || msg.includes("Permission denied")) {
      return {
        ok: false,
        error: `DockerConnectionError: Cannot access Docker socket — ${msg}. Fix: add user to docker group (sudo usermod -aG docker $USER) or run as root.`,
      };
    }
    if (msg.includes("ENOENT") || msg.includes("no such file")) {
      return {
        ok: false,
        error: `DockerConnectionError: Docker socket not found at /var/run/docker.sock — ${msg}. Fix: install Docker (https://docs.docker.com/engine/install/) and ensure the daemon is running.`,
      };
    }
    return {
      ok: false,
      error: `DockerConnectionError: Cannot connect to Docker daemon — ${msg}. Fix: ensure Docker is running (systemctl status docker).`,
    };
  }
}

/**
 * Run a Docker API call with a configurable timeout.
 * Returns structured error on timeout instead of hanging indefinitely.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new DockerTimeoutError(`Docker API call "${label}" timed out after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

export function formatError(error: unknown): string {
  if (error instanceof DockerConnectionError) return `${error.name}: ${error.message}`;
  if (error instanceof DockerTimeoutError) return `${error.name}: ${error.message}`;
  if (error instanceof DockerPermissionError) return `${error.name}: ${error.message}`;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

export function formatContainer(container: Dockerode.ContainerInfo): Record<string, unknown> {
  return {
    id: container.Id.substring(0, 12),
    name: container.Names[0]?.replace(/^\//, ""),
    image: container.Image,
    state: container.State,
    status: container.Status,
    created: new Date(container.Created * 1000).toISOString(),
    ports: container.Ports.map((p) => ({
      private: p.PrivatePort,
      public: p.PublicPort,
      type: p.Type,
    })),
    labels: container.Labels,
    mounts: container.Mounts.map((m) => ({
      type: m.Type,
      source: m.Source,
      destination: m.Destination,
      mode: m.Mode,
      rw: m.RW,
    })),
  };
}

export function formatImage(image: Dockerode.ImageInfo): Record<string, unknown> {
  return {
    id: image.Id.substring(0, 19),
    tags: image.RepoTags || ["<none>:<none>"],
    size: image.Size,
    created: new Date(image.Created).toISOString(),
  };
}

/**
 * Sanitize tool output: strip ANSI escapes, invisible Unicode, and truncate.
 * Prevents prompt injection via output and caps LLM context cost.
 */
export function sanitizeOutput(text: string, maxLength = 1_000_000): string {
  // Strip ANSI escape codes (CSI, OSC, simple sequences)
  text = text.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, "");
  text = text.replace(/\x1b\][^\x07]*\x07/g, ""); // OSC terminated by BEL
  text = text.replace(/\x1b[@-Z\\-_]/g, "");       // Single-char escapes
  // Strip invisible Unicode (Tag chars, bidi overrides, zero-width)
  text = text.replace(/[\u{E0000}-\u{E007F}\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/gu, "");
  // Strip Docker stream-frame headers (8-byte prefix per frame)
  text = text.replace(/^[\x00-\x0f]{8}/gm, "");
  // Truncate to cap memory and LLM context cost
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + `\n... [output truncated at ${maxLength} chars]`;
  }
  return text;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
