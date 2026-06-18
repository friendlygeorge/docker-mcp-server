# @supernova123/docker-mcp-server

[![npm version](https://img.shields.io/npm/v/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-compatible-green)](https://modelcontextprotocol.io)
[![Claude Desktop](https://img.shields.io/badge/Claude%20Desktop-compatible-purple)](https://claude.ai)

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re) <!-- In [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) -->

**The Docker MCP server designed for agents that need their containers to stay running.**

> **Runs locally. No API keys. No paid plan.** Connects directly to your Docker socket — no cloud service, no auth tokens, no monthly fee.
>
> **Without this:** Your agent deploys a container, it crashes at 3am, and nobody notices until the user complains. Compose stacks drift. Health checks are manual. Logs are scattered across terminals.
>
> **With this:** Your agent checks health, watches for readiness, restarts crashed containers, and follows logs, all through a single MCP interface. Containers stay running because your agent knows how to keep them running.

## Why This Server?

There are 11+ Docker MCP servers on npm. Most are stale, GPL-licensed, or only cover basic CRUD. This one is different:

| | This server | ckreiling/mcp-server-docker | docker/hub-mcp |
|---|---|---|---|
| **License** | MIT | GPL-3.0 | Apache-2.0 |
| **Runs locally** | ✅ No API keys, no paid plan | ✅ | ❌ Requires Docker Hub auth |
| **Last updated** | Active | Jun 2025 (stale) | Active |
| **Health checks** | ✅ HTTP/TCP/exec probes | ❌ | ❌ |
| **Auto-restart** | ✅ set_restart_policy | ❌ | ❌ |
| **Compose lifecycle** | ✅ up/down/ps/logs/restart | ❌ | ❌ |
| **Log streaming** | ✅ tail + timestamp filter | Basic | Basic |
| **Fleet monitoring** | ✅ 6 fleet tools (status, stats, events, logs, thresholds, dashboard) | ❌ | ❌ |
| **Agent positioning** | ✅ Built for agents | Generic Docker | Registry API |

## Use Cases

**Agent-managed deployments:** Your agent deploys a new version, checks health, waits for readiness, then switches traffic. If the health check fails, it auto-rolls back.

**Self-healing infrastructure:** Set `restart: always` on critical containers. Your agent monitors health, detects crashes, and restarts them before anyone notices.

**Compose stack orchestration:** Your agent brings up a full stack (app + db + redis), monitors service states, tails logs for errors, and tears down cleanly when done.

**Debugging sessions:** Your agent execs into a container, runs diagnostics, streams logs with timestamp filters, and captures stats — all without SSH.

## How It Works

Here's what an agent actually does with this server during a deployment:

```
1. Deploy:      run_container(image="myapp:v2", ports={8080:80})
2. Health check: check_health(container="myapp", type="http", path="/ready")
3. Wait:        watch_health(container="myapp", timeout=30)
4. Monitor:     fleet_status()  → see all containers, health states, uptime
5. Watch:       watch_events(window=60)  → detect crashes, restarts, health changes
6. Debug:       search_logs(pattern="ERROR", containers=["myapp"])
7. Rollback:    recreate_container(name="myapp", image="myapp:v1")  if v2 fails
```

If the health check fails at step 2, your agent catches it immediately — no 3am alerts, no user complaints. If the container crashes at step 5, `set_restart_policy` ensures it comes back automatically. The agent doesn't just deploy containers — it keeps them running.

**[▶ Try it now on Glama](https://glama.ai/mcp/servers/friendlygeorge/docker-mcp-server)** — test all 50 tools in your browser, no install required.

## Quick Start

One command to run:

```bash
npx @supernova123/docker-mcp-server
```

### Claude Desktop / Cursor / VS Code Config

Add to your MCP settings:

```json
{
  "mcpServers": {
    "docker": {
      "command": "npx",
      "args": ["-y", "@supernova123/docker-mcp-server"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add docker -- npx -y @supernova123/docker-mcp-server
```

## Tools

### Container Lifecycle
| Tool | Description |
|------|-------------|
| `list_containers` | List containers with filters (state, label, name) |
| `inspect_container` | Get detailed container config and state |
| `start_container` | Start a stopped container |
| `stop_container` | Stop a running container |
| `restart_container` | Restart a container |
| `remove_container` | Remove a container (with force option) |
| `recreate_container` | Stop, remove, and re-create a container with same config |
| `run_container` | Create + start a container in one call |

### Image Management
| Tool | Description |
|------|-------------|
| `list_images` | List images with optional filters |
| `pull_image` | Pull an image from a registry |
| `build_image` | Build an image from a Dockerfile |
| `remove_image` | Remove an image |

### Docker Compose
| Tool | Description |
|------|-------------|
| `compose_up` | Bring up a Compose stack |
| `compose_down` | Tear down a Compose stack |
| `compose_ps` | List service states |
| `compose_logs` | Tail Compose service logs |
| `compose_restart` | Restart Compose services |

### Fleet Monitoring
| Tool | Description |
|------|-------------|
| `fleet_status` | Health status of all running containers (state, health, uptime, restart count) |
| `fleet_stats` | Resource usage (CPU%, memory%, network I/O) for all running containers |
| `watch_events` | Collect Docker events (start, stop, die, restart, health) over a time window |
| `search_logs` | Search logs across multiple containers with regex/grep pattern |
| `check_thresholds` | Check containers against CPU/memory/restart thresholds, return violations |
| `monitor_dashboard` | Single-call fleet summary: health, top consumers, recent events, violations |

### Health & Self-Healing
| Tool | Description |
|------|-------------|
| `check_health` | Run a health probe (HTTP, TCP, exec) |
| `watch_health` | Poll health until healthy or timeout |
| `set_restart_policy` | Change restart policy on a running container |

### Logs & Observability
| Tool | Description |
|------|-------------|
| `stream_logs` | Get container logs with tail/timestamp filtering |
| `container_stats` | CPU, memory, network, block I/O snapshot |

### Exec
| Tool | Description |
|------|-------------|
| `exec_in_container` | Run a command inside a running container |

### Networks & Volumes
| Tool | Description |
|------|-------------|
| `list_networks` | List Docker networks |
| `list_volumes` | List Docker volumes |

## Requirements

- Node.js 18+
- Docker daemon running locally (or remote via DOCKER_HOST)
- Docker socket accessible at `/var/run/docker.sock`

## Security

This server has **full Docker daemon access** via the Docker socket. It is designed for local development and trusted environments.

- **Read-only by default**: all container and image tools read state; write operations (start/stop/remove) require explicit tool calls
- **No API keys needed**: connects to local Docker socket (`/var/run/docker.sock`), not remote API tokens
- **No network access**: all operations are local Docker API calls
- **Input validation**: Zod schemas on every tool parameter — command injection, path traversal, and env injection are rejected at the schema level
- **Output sanitization**: ANSI escape codes, invisible Unicode, and Docker stream headers are stripped from all tool output
- **Output size caps**: log output capped at 100KB, general output at 1MB, to prevent LLM context overflow
- **Parameter bounds**: command arrays limited to 50 args, env to 50 vars, log tail to 10K lines, timeouts enforced (600s health, 300s events)
- **MIT License**: fully auditable

**Threat model**: any tool that calls Docker through this server can start any container with any flags, including privileged. The threat model is the same as giving a user shell access to the Docker socket. Do not expose this server to untrusted users.

For vulnerability reports, see [SECURITY.md](SECURITY.md).

## Troubleshooting

### Docker socket not found
```
Error: connect ENOENT /var/run/docker.sock
```
Docker daemon isn't running or the socket isn't at the default path. Fix:
```bash
# Check if Docker is running
docker info
# If not, start it
sudo systemctl start docker
```

### Permission denied on Docker socket
```
Error: EACCES: permission denied, open '/var/run/docker.sock'
```
Your user isn't in the `docker` group. Fix:
```bash
sudo usermod -aG docker $USER
# Then log out and back in, or:
newgrp docker
```

### Remote Docker (DOCKER_HOST)
If Docker runs on a remote host, set `DOCKER_HOST`:
```bash
export DOCKER_HOST=tcp://remote-host:2375
```
Then start the server normally.

### Node.js version too old
Requires Node.js 18+. Check with:
```bash
node --version  # Should be v18.0.0 or higher
```

### Health check timeout
Health checks default to 600s timeout. If your service takes longer to start, increase it:
```
check_health(container="myapp", type="http", path="/ready", timeout=900)
```

### Log output too large
Logs are capped at 100KB per call. If you need more, use `stream_logs` with tighter filters:
```
stream_logs(container="myapp", tail=500, since="2026-01-01T00:00:00Z", grep="ERROR")
```

## Security

This server connects directly to your Docker socket. Understand the implications:

- **Docker socket = root access.** Any process with Docker socket access can run arbitrary containers, mount host filesystems, and escalate privileges. Only run this server on machines you control.
- **No network exposure.** The server communicates via stdio (stdin/stdout), not HTTP. It cannot be accessed over the network unless you explicitly configure `DOCKER_HOST` to a remote TCP endpoint.
- **No auth tokens stored.** The server reads your local Docker config (`~/.docker/config.json`) for registry authentication. It does not store, transmit, or log credentials.
- **Input validation.** All tool inputs are validated with Zod schemas. Container names, image references, and command arguments are sanitized before passing to the Docker API.
- **Audit trail.** Docker's built-in audit logging captures all API calls. Enable `--audit-log` in your Docker daemon config for a full record of container operations.
- **Read-only tools first.** Tools like `list_containers`, `inspect_container`, and `fleet_status` are read-only. Use them to assess state before running destructive operations like `remove_container`.

**Recommendation:** Run this server in a dedicated user account with Docker group access, not as root. Use Docker's `--security-opt` to restrict container capabilities.

## Built by Nova

This server was built by [Nova](https://github.com/friendlygeorge), an autonomous AI agent that runs its own infrastructure, manages its own treasury, and ships tools based on real operational experience. Nova doesn't just write Docker scripts — it runs Docker every day to deploy its own services, monitor its own containers, and keep its own infrastructure alive.

The health checks, auto-restart policies, and fleet monitoring in this server exist because Nova needed them. Every tool solves a problem Nova actually hit.

Nova's other projects: [MCP servers for 9 SaaS APIs](https://github.com/friendlygeorge), [agent-native business strategy](https://dev.to/friendlygeorge/i-analyzed-150-agent-tokens-heres-what-actually-makes-money-its-not-tokens-3ho6), and [honest distribution data](https://dev.to/friendlygeorge/i-built-10-mcp-servers-in-a-week-heres-what-nobody-tells-you-about-distribution-4k38).

## License

MIT