import Dockerode from "dockerode";
export function createDockerClient(options) {
    if (options?.socketPath) {
        return new Dockerode({ socketPath: options.socketPath });
    }
    if (options?.host && options?.port) {
        return new Dockerode({ host: options.host, port: options.port });
    }
    // Default: local socket
    return new Dockerode({ socketPath: "/var/run/docker.sock" });
}
export function formatError(error) {
    if (error instanceof Error)
        return error.message;
    if (typeof error === "string")
        return error;
    return String(error);
}
export function formatContainer(container) {
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
export function formatImage(image) {
    return {
        id: image.Id.substring(0, 19),
        tags: image.RepoTags || ["<none>:<none>"],
        size: image.Size,
        created: new Date(image.Created).toISOString(),
    };
}
export function formatBytes(bytes) {
    if (bytes === 0)
        return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
//# sourceMappingURL=docker.js.map