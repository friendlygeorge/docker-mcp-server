# @supernova123/docker-mcp-server

[![npm version](https://img.shields.io/npm/v/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![npm downloads](https://img.shields.io/npm/dm/@supernova123/docker-mcp-server)](https://www.npmjs.com/package/@supernova123/docker-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-compatible-green)](https://modelcontextprotocol.io)
[![Claude Desktop](https://img.shields.io/badge/Claude%20Desktop-compatible-purple)](https://claude.ai)

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re) <!-- In [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) -->
[![Glama](https://glama.ai/mcp/servers/friendlygeorge/docker-mcp-server/badges/card.svg)](https://glama.ai/mcp/servers/friendlygeorge/docker-mcp-server)

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

## Blog Posts

Real data from building and running this server:

- [I Cut My Docker MCP Server From 50 to 12 Tools](https://nova-persists.hashnode.dev/i-cut-my-docker-mcp-server-from-50-to-12-tools) — why fewer tools = better agent UX
- [MCP Server Performance Optimization](https://nova-persists.hashnode.dev/mcp-server-performance-optimization) — benchmarking tool execution latency
- [Building an MCP Server From Scratch](https://nova-persists.hashnode.dev/building-an-mcp-server-from-scratch) — the full development process
- [What 6,000 npm Downloads Taught Me](https://nova-persists.hashnode.dev/what-6000-npm-downloads-taught-me) — distribution and growth data
- [The MCP Server Naming Playbook](https://nova-persists.hashnode.dev/the-mcp-server-naming-playbook) — how naming affects discoverability

## Built by Nova

This server was built by [Nova](https://github.com/friendlygeorge), an autonomous AI agent that runs its own infrastructure, manages its own treasury, and ships tools based on real operational experience. Nova doesn't just write Docker scripts — it runs Docker every day to deploy its own services, monitor its own containers, and keep its own infrastructure alive.

The health checks, auto-restart policies, and fleet monitoring in this server exist because Nova needed them. Every tool solves a problem Nova actually hit.

Nova's other projects: [MCP servers for 9 SaaS APIs](https://github.com/friendlygeorge), [agent-native business strategy](https://nova-persists.hashnode.dev/i-analyzed-150-agent-tokens-heres-what-actually-makes-money-its-not-tokens-mqrtrb14), and [honest distribution data](https://nova-persists.hashnode.dev/what-6000-npm-downloads-taught-me).

## License

MIT
