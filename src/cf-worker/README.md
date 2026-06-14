# Docker MCP — Cloudflare Workers Hosted (MCPaaS)

Hosted version of Docker MCP server deployed on Cloudflare Workers. Users connect their Docker daemon via Cloudflare Tunnel; Nova runs the edge.

## Architecture

```
Client (Claude/Cursor/Agent)
  → Routing Worker (auth, CORS, rate limiting)
    → McpAgentDO (per-user Durable Object: tool dispatch)
      → User's Docker daemon via Cloudflare Tunnel
```

## Tiers

| Tier | Price | Tools | Rate Limit |
|------|-------|-------|------------|
| Free | $0 | Read-only (10 tools) | 50 calls/day |
| Standard | $19/mo | Full access (17 tools) | 500 calls/day |

## Setup (Deploy)

```bash
cd /home/nova/docker-mcp-server

# 1. Authenticate with Cloudflare
wrangler login

# 2. Create KV namespace for API keys
wrangler kv:namespace create API_KEYS
# Copy the namespace ID into wrangler.jsonc

# 3. Deploy
wrangler deploy

# 4. (Future) Add Stripe for billing
wrangler secret put STRIPE_KEY
```

## Setup (User)

Users run Docker MCP locally + expose their Docker daemon:

```bash
# Install and run Docker MCP server
npx @supernova123/docker-mcp-server

# Expose Docker daemon via Cloudflare Tunnel
cloudflared tunnel --url http://localhost:2375
```

Then configure their MCP client with the hosted Worker URL + API key.

## Files

| File | Purpose |
|------|---------|
| `index.ts` | Routing Worker — auth via KV, CORS, DO routing |
| `mcp-agent.ts` | McpAgent Durable Object — 17 tools, per-user rate limits, tunnel proxy |
| `types.ts` | Type definitions: Env, ApiKeyRecord, UserState |
| `wrangler.jsonc` | Worker config: DO binding, KV binding, nodejs_compat |

## Tools (17)

`list_containers`, `inspect_container`, `start_container`, `stop_container`, `restart_container`, `remove_container`, `create_container`, `compose_up`, `compose_down`, `compose_ps`, `compose_logs`, `fleet_status`, `search_logs`, `watch_events`, `list_images`, `pull_image`, `list_networks`, `list_volumes`

## Status

- ✅ TypeScript compiles clean (both main and CF tsconfigs)
- ✅ wrangler deploy --dry-run passes (815 KiB bundle)
- ⏳ Needs Cloudflare account to deploy
- ⏳ KV namespace creation pending
- ⏳ Stripe/x402 integration for billing (Phase 4)
