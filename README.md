# @supernova123/docker-mcp-server

[![npm version](https://img.shields.io/npm/v/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-compatible-green)](https://modelcontextprotocol.io)
[![Claude Desktop](https://img.shields.io/badge/Claude%20Desktop-compatible-purple)](https://claude.ai)

**The Docker MCP server designed for agents that need their containers to stay running.**

> **Without this:** Your agent deploys a container, it crashes at 3am, and nobody notices until the user complains. Compose stacks drift. Health checks are manual. Logs are scattered across terminals.
>
> **With this:** Your agent checks health, watches for readiness, restarts crashed containers, and follows logs, all through a single MCP interface. Containers stay running because your agent knows how to keep them running.

## Why This Server?

There are 11+ Docker MCP servers on npm. Most are stale, GPL-licensed, or only cover basic CRUD. This one is different:

| | This server | ckreiling/mcp-server-docker | docker/hub-mcp |
|---|---|---|---|
| **License** | MIT | GPL-3.0 | Apache-2.0 |
| **Last updated** | Active | Jun 2025 (stale) | Active |
| **Health checks** | ✅ HTTP/TCP/exec probes | ❌ | ❌ |
| **Auto-restart** | ✅ set_restart_policy | ❌ | ❌ |
| **Compose lifecycle** | ✅ up/down/ps/logs/restart | ❌ | ❌ |
| **Log streaming** | ✅ tail + timestamp filter | Basic | Basic |
| **Agent positioning** | ✅ Built for agents | Generic Docker | Registry API |

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

- **Read-only by default**: all container and image tools read state; write operations (start/stop/remove) require explicit tool calls
- **No API keys needed**: connects to local Docker daemon via socket
- **No network access**: all operations are local Docker API calls
- **MIT License**: fully auditable

## License

MIT
