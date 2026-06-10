import { ListNetworksSchema, ListVolumesSchema } from "../types.js";
import { formatError } from "../docker.js";
export function registerNetworkTools(server, docker) {
    server.tool("list_networks", "List Docker networks with optional filter. Returns network IDs, names, drivers, and scopes.", ListNetworksSchema.shape, async (params) => {
        try {
            const networks = await docker.listNetworks({
                filters: params.filter ? JSON.stringify({ name: [params.filter] }) : undefined,
            });
            const results = networks.map((n) => ({
                id: n.Id.substring(0, 12),
                name: n.Name,
                driver: n.Driver,
                scope: n.Scope,
                created: n.Created,
                containers: n.Containers
                    ? Object.fromEntries(Object.entries(n.Containers).map(([id, c]) => [
                        id.substring(0, 12),
                        { name: c.Name, ipv4: c.IPv4Address },
                    ]))
                    : {},
            }));
            return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
        }
    });
    server.tool("list_volumes", "List Docker volumes with optional filter. Returns volume names, drivers, mount points, and labels.", ListVolumesSchema.shape, async (params) => {
        try {
            const result = await docker.listVolumes({
                filters: params.filter ? JSON.stringify({ name: [params.filter] }) : undefined,
            });
            const volumes = (result.Volumes || []).map((v) => ({
                name: v.Name,
                driver: v.Driver,
                mountpoint: v.Mountpoint,
                created: v.CreatedAt ?? v.Created,
                labels: v.Labels,
            }));
            return { content: [{ type: "text", text: JSON.stringify(volumes, null, 2) }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=network.js.map