import { z } from "zod";
export declare const ListContainersSchema: z.ZodObject<{
    all: z.ZodOptional<z.ZodBoolean>;
    label: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    name: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodEnum<["running", "stopped", "paused", "exited", "created", "restarting"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    state?: "created" | "running" | "stopped" | "paused" | "exited" | "restarting" | undefined;
    all?: boolean | undefined;
    label?: string[] | undefined;
}, {
    name?: string | undefined;
    state?: "created" | "running" | "stopped" | "paused" | "exited" | "restarting" | undefined;
    all?: boolean | undefined;
    label?: string[] | undefined;
}>;
export declare const InspectContainerSchema: z.ZodObject<{
    container_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    container_id: string;
}, {
    container_id: string;
}>;
export declare const StartContainerSchema: z.ZodObject<{
    container_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    container_id: string;
}, {
    container_id: string;
}>;
export declare const StopContainerSchema: z.ZodObject<{
    container_id: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    timeout?: number | undefined;
}, {
    container_id: string;
    timeout?: number | undefined;
}>;
export declare const RestartContainerSchema: z.ZodObject<{
    container_id: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    timeout?: number | undefined;
}, {
    container_id: string;
    timeout?: number | undefined;
}>;
export declare const RemoveContainerSchema: z.ZodObject<{
    container_id: z.ZodString;
    force: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    force?: boolean | undefined;
}, {
    container_id: string;
    force?: boolean | undefined;
}>;
export declare const RecreateContainerSchema: z.ZodObject<{
    container_id: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    timeout?: number | undefined;
}, {
    container_id: string;
    timeout?: number | undefined;
}>;
export declare const RunContainerSchema: z.ZodObject<{
    image: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    ports: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    volumes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    restart_policy: z.ZodOptional<z.ZodEnum<["no", "always", "unless-stopped", "on-failure"]>>;
    command: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    detach: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    image: string;
    name?: string | undefined;
    ports?: Record<string, string> | undefined;
    env?: Record<string, string> | undefined;
    volumes?: string[] | undefined;
    restart_policy?: "no" | "always" | "unless-stopped" | "on-failure" | undefined;
    command?: string[] | undefined;
    detach?: boolean | undefined;
}, {
    image: string;
    name?: string | undefined;
    ports?: Record<string, string> | undefined;
    env?: Record<string, string> | undefined;
    volumes?: string[] | undefined;
    restart_policy?: "no" | "always" | "unless-stopped" | "on-failure" | undefined;
    command?: string[] | undefined;
    detach?: boolean | undefined;
}>;
export declare const ListImagesSchema: z.ZodObject<{
    all: z.ZodOptional<z.ZodBoolean>;
    filter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filter?: string | undefined;
    all?: boolean | undefined;
}, {
    filter?: string | undefined;
    all?: boolean | undefined;
}>;
export declare const PullImageSchema: z.ZodObject<{
    image: z.ZodString;
    tag: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    image: string;
    tag?: string | undefined;
}, {
    image: string;
    tag?: string | undefined;
}>;
export declare const BuildImageSchema: z.ZodObject<{
    context: z.ZodString;
    tag: z.ZodString;
    dockerfile: z.ZodOptional<z.ZodString>;
    build_args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    target: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tag: string;
    context: string;
    dockerfile?: string | undefined;
    build_args?: Record<string, string> | undefined;
    target?: string | undefined;
}, {
    tag: string;
    context: string;
    dockerfile?: string | undefined;
    build_args?: Record<string, string> | undefined;
    target?: string | undefined;
}>;
export declare const RemoveImageSchema: z.ZodObject<{
    image: z.ZodString;
    force: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    image: string;
    force?: boolean | undefined;
}, {
    image: string;
    force?: boolean | undefined;
}>;
export declare const ComposeUpSchema: z.ZodObject<{
    path: z.ZodString;
    build: z.ZodOptional<z.ZodBoolean>;
    detach: z.ZodOptional<z.ZodBoolean>;
    services: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    path: string;
    detach?: boolean | undefined;
    build?: boolean | undefined;
    services?: string[] | undefined;
}, {
    path: string;
    detach?: boolean | undefined;
    build?: boolean | undefined;
    services?: string[] | undefined;
}>;
export declare const ComposeDownSchema: z.ZodObject<{
    path: z.ZodString;
    volumes: z.ZodOptional<z.ZodBoolean>;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    path: string;
    timeout?: number | undefined;
    volumes?: boolean | undefined;
}, {
    path: string;
    timeout?: number | undefined;
    volumes?: boolean | undefined;
}>;
export declare const ComposePsSchema: z.ZodObject<{
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
}, {
    path: string;
}>;
export declare const ComposeLogsSchema: z.ZodObject<{
    path: z.ZodString;
    services: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tail: z.ZodOptional<z.ZodNumber>;
    follow: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    path: string;
    services?: string[] | undefined;
    tail?: number | undefined;
    follow?: boolean | undefined;
}, {
    path: string;
    services?: string[] | undefined;
    tail?: number | undefined;
    follow?: boolean | undefined;
}>;
export declare const ComposeRestartSchema: z.ZodObject<{
    path: z.ZodString;
    services: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    path: string;
    timeout?: number | undefined;
    services?: string[] | undefined;
}, {
    path: string;
    timeout?: number | undefined;
    services?: string[] | undefined;
}>;
export declare const CheckHealthSchema: z.ZodObject<{
    container_id: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<["http", "tcp", "exec"]>>;
    endpoint: z.ZodOptional<z.ZodString>;
    command: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    type?: "http" | "tcp" | "exec" | undefined;
    command?: string[] | undefined;
    endpoint?: string | undefined;
}, {
    container_id: string;
    type?: "http" | "tcp" | "exec" | undefined;
    command?: string[] | undefined;
    endpoint?: string | undefined;
}>;
export declare const WatchHealthSchema: z.ZodObject<{
    container_id: z.ZodString;
    timeout: z.ZodOptional<z.ZodNumber>;
    interval: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    timeout?: number | undefined;
    interval?: number | undefined;
}, {
    container_id: string;
    timeout?: number | undefined;
    interval?: number | undefined;
}>;
export declare const SetRestartPolicySchema: z.ZodObject<{
    container_id: z.ZodString;
    policy: z.ZodEnum<["no", "always", "unless-stopped", "on-failure"]>;
    max_retry_count: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    policy: "no" | "always" | "unless-stopped" | "on-failure";
    max_retry_count?: number | undefined;
}, {
    container_id: string;
    policy: "no" | "always" | "unless-stopped" | "on-failure";
    max_retry_count?: number | undefined;
}>;
export declare const StreamLogsSchema: z.ZodObject<{
    container_id: z.ZodString;
    tail: z.ZodOptional<z.ZodNumber>;
    since: z.ZodOptional<z.ZodString>;
    follow: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    tail?: number | undefined;
    follow?: boolean | undefined;
    since?: string | undefined;
}, {
    container_id: string;
    tail?: number | undefined;
    follow?: boolean | undefined;
    since?: string | undefined;
}>;
export declare const ContainerStatsSchema: z.ZodObject<{
    container_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    container_id: string;
}, {
    container_id: string;
}>;
export declare const ExecInContainerSchema: z.ZodObject<{
    container_id: z.ZodString;
    command: z.ZodArray<z.ZodString, "many">;
    working_dir: z.ZodOptional<z.ZodString>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    container_id: string;
    command: string[];
    env?: Record<string, string> | undefined;
    working_dir?: string | undefined;
}, {
    container_id: string;
    command: string[];
    env?: Record<string, string> | undefined;
    working_dir?: string | undefined;
}>;
export declare const ListNetworksSchema: z.ZodObject<{
    filter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filter?: string | undefined;
}, {
    filter?: string | undefined;
}>;
export declare const ListVolumesSchema: z.ZodObject<{
    filter: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filter?: string | undefined;
}, {
    filter?: string | undefined;
}>;
//# sourceMappingURL=types.d.ts.map