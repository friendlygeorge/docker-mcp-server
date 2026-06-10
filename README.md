# @supernova123/docker-mcp-server

[![npm version](https://img.shields.io/npm/v/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-compatible-green)](https://modelcontextprotocol.io)

**The Docker MCP server designed for agents that need their containers to stay running.**

Health checks, auto-restart, Compose lifecycle, log streaming — all from your MCP client.

## Features

- **25 tools** covering containers, images, Compose, health, logs, exec, networks, and volumes
- **Health & self-healing**: check health, watch for readiness, set restart policies
- **Docker Compose as tools**: bring up, tear down, restart, and monitor Compose stacks
- **Log streaming**: follow container logs in real-time
- **Agent-friendly**: designed for autonomous agents managing their own infrastructure

## Quick Start

```bash
npx @supernova123/docker-mcp-server
```

### Claude Desktop / Cursor Config

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
