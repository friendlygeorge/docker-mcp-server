import { execSync, exec as execCb } from "child_process";
import { promisify } from "util";
import { ComposeUpSchema, ComposeDownSchema, ComposePsSchema, ComposeLogsSchema, ComposeRestartSchema, } from "../types.js";
import { formatError } from "../docker.js";
const execAsync = promisify(execCb);
function runCompose(path, args) {
    try {
        const result = execSync(`docker compose -f ${path} ${args.join(" ")}`, {
            encoding: "utf-8",
            timeout: 30000,
        });
        return result.trim();
    }
    catch (error) {
        const err = error;
        throw new Error(err.stderr || err.stdout || formatError(error));
    }
}
export function registerComposeTools(server) {
    server.tool("compose_up", "Bring up Docker Compose services from a docker-compose.yml file. Optionally build images first.", ComposeUpSchema.shape, async (params) => {
        try {
            const args = ["up", "-d"];
            if (params.build)
                args.push("--build");
            if (params.services?.length)
                args.push(...params.services);
            const output = runCompose(params.path, args);
            return { content: [{ type: "text", text: output || "Compose services started." }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
        }
    });
    server.tool("compose_down", "Tear down Docker Compose services. Optionally remove named volumes.", ComposeDownSchema.shape, async (params) => {
        try {
            const args = ["down"];
            if (params.volumes)
                args.push("-v");
            if (params.timeout)
                args.push(`--timeout ${params.timeout}`);
            const output = runCompose(params.path, args);
            return { content: [{ type: "text", text: output || "Compose services stopped." }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
        }
    });
    server.tool("compose_ps", "List service states across a Docker Compose stack.", ComposePsSchema.shape, async (params) => {
        try {
            const output = runCompose(params.path, ["ps", "--format", "json"]);
            const lines = output.split("\n").filter(Boolean);
            const services = lines.map((line) => {
                try {
                    return JSON.parse(line);
                }
                catch {
                    return { raw: line };
                }
            });
            return { content: [{ type: "text", text: JSON.stringify(services, null, 2) }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
        }
    });
    server.tool("compose_logs", "Tail logs from Docker Compose services. Supports filtering by service and line count.", ComposeLogsSchema.shape, async (params) => {
        try {
            const args = ["logs", "--tail", String(params.tail ?? 100)];
            if (params.follow)
                args.push("-f");
            if (params.services?.length)
                args.push(...params.services);
            const output = runCompose(params.path, args);
            return { content: [{ type: "text", text: output || "No logs found." }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
        }
    });
    server.tool("compose_restart", "Restart Docker Compose services. Restart specific services or the entire stack.", ComposeRestartSchema.shape, async (params) => {
        try {
            const args = ["restart"];
            if (params.timeout)
                args.push(`--timeout ${params.timeout}`);
            if (params.services?.length)
                args.push(...params.services);
            const output = runCompose(params.path, args);
            return { content: [{ type: "text", text: output || "Compose services restarted." }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
        }
    });
}
//# sourceMappingURL=compose.js.map