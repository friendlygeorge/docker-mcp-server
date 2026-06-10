import Dockerode from "dockerode";
export interface DockerClientOptions {
    socketPath?: string;
    host?: string;
    port?: number;
}
export declare function createDockerClient(options?: DockerClientOptions): Dockerode;
export declare function formatError(error: unknown): string;
export declare function formatContainer(container: Dockerode.ContainerInfo): Record<string, unknown>;
export declare function formatImage(image: Dockerode.ImageInfo): Record<string, unknown>;
export declare function formatBytes(bytes: number): string;
//# sourceMappingURL=docker.d.ts.map