import Dockerode from "dockerode";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ListImagesSchema,
  PullImageSchema,
  BuildImageSchema,
  RemoveImageSchema,
} from "../types.js";
import { formatImage, formatError, withRetry } from "../docker.js";

export function registerImageTools(server: McpServer, docker: Dockerode): void {
  server.tool(
    "list_images",
    "List Docker images with optional filters. Returns image IDs, tags, sizes, and creation dates.",
    ListImagesSchema.shape,
    { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    async (params) => {
      try {
        const images = await withRetry(() => docker.listImages({
          all: params.all ?? false,
          filters: params.filter ? JSON.stringify({ reference: [params.filter] }) : undefined,
        }), { label: "list_images" });
        const results = images.map(formatImage);
        return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "pull_image",
    "Pull a Docker image from a registry. Returns pull progress events.",
    PullImageSchema.shape,
    { idempotentHint: true, openWorldHint: false },
    async (params) => {
      try {
        const imageRef = params.tag ? `${params.image}:${params.tag}` : params.image;
        const stream = await docker.pull(imageRef);
        // Wait for pull to complete
        await new Promise<void>((resolve, reject) => {
          docker.modem.followProgress(stream, (err: Error | null) => {
            if (err) reject(err);
            else resolve();
          });
        });
        return { content: [{ type: "text", text: `Image ${imageRef} pulled successfully.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "build_image",
    "Build a Docker image from a Dockerfile or build context path.",
    BuildImageSchema.shape,
    { idempotentHint: true, openWorldHint: false },
    async (params) => {
      try {
        const stream = await docker.buildImage(
          {
            context: params.context,
            src: [params.dockerfile ?? "Dockerfile"],
          },
          { t: params.tag, dockerfile: params.dockerfile, buildargs: params.build_args, target: params.target }
        );
        await new Promise<void>((resolve, reject) => {
          docker.modem.followProgress(stream, (err: Error | null) => {
            if (err) reject(err);
            else resolve();
          });
        });
        return { content: [{ type: "text", text: `Image ${params.tag} built successfully.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );

  server.tool(
    "remove_image",
    "Remove a Docker image by name or ID. Use force to remove even if tagged.",
    RemoveImageSchema.shape,
    { destructiveHint: true, openWorldHint: false },
    async (params) => {
      try {
        const image = docker.getImage(params.image);
        await image.remove({ force: params.force ?? false });
        return { content: [{ type: "text", text: `Image ${params.image} removed.` }] };
      } catch (error) {
        return { content: [{ type: "text", text: `Error: ${formatError(error)}` }], isError: true };
      }
    }
  );
}