import { z } from "zod";
import * as MediaService from "@/features/media/service/media.service";
import type { OAuthScopeRequest } from "@/features/oauth-provider/schema/oauth-provider.schema";
import { defineMcpTool } from "../../../service/mcp-tool";

const MEDIA_UPLOAD_REQUIRED_SCOPES: OAuthScopeRequest = {
  media: ["write"],
};

const MAX_BYTES = 20 * 1024 * 1024;

const McpMediaUploadInputSchema = z.object({
  imageUrl: z
    .string()
    .url()
    .describe(
      "Publicly accessible URL of the image to fetch and store in the blog's R2.",
    ),
  fileName: z
    .string()
    .min(1)
    .max(255)
    .optional()
    .describe(
      "Optional file name including extension. If omitted, derived from the URL path basename.",
    ),
});

const McpMediaUploadOutputSchema = z.object({
  id: z.number().describe("Numeric media ID."),
  key: z.string().describe("Stable R2 storage key."),
  url: z.string().describe("Relative media URL (/images/<key>)."),
  absoluteUrl: z
    .string()
    .describe("Absolute URL ready to embed in post markdown."),
  fileName: z.string(),
  mimeType: z.string(),
  sizeInBytes: z.number(),
  width: z.number().nullable(),
  height: z.number().nullable(),
});

function deriveFileName(
  imageUrl: string,
  contentType: string,
  override?: string,
): string {
  if (override) return override;
  try {
    const parsed = new URL(imageUrl);
    const last = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
    if (last && /\.[a-z0-9]+$/i.test(last)) return last;
  } catch {
    /* fall through */
  }
  const ext = (contentType.split("/")[1] ?? "bin").split(";")[0].trim();
  return `image-${Date.now()}.${ext}`;
}

export const mediaUploadTool = defineMcpTool({
  name: "media_upload",
  description:
    "Fetch an image from a public URL and store it permanently in the blog's R2 media library. " +
    "Returns the new media record plus an absolute URL suitable for embedding in post markdown. " +
    "Use this when authoring posts that reference AI-generated or external images, so the image " +
    "is hosted on the blog's own CDN rather than a temporary third-party URL.",
  requiredScopes: MEDIA_UPLOAD_REQUIRED_SCOPES,
  inputSchema: McpMediaUploadInputSchema,
  outputSchema: McpMediaUploadOutputSchema,
  async handler(args, context) {
    const sourceResponse = await fetch(args.imageUrl, {
      headers: { Accept: "image/*" },
    });

    if (!sourceResponse.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch source image: HTTP ${sourceResponse.status} ${sourceResponse.statusText}`,
          },
        ],
        isError: true,
      };
    }

    const contentType = sourceResponse.headers.get("Content-Type") ?? "";
    if (!contentType.toLowerCase().startsWith("image/")) {
      return {
        content: [
          {
            type: "text",
            text: `Refused: source URL did not return an image (Content-Type: ${contentType || "unknown"}).`,
          },
        ],
        isError: true,
      };
    }

    const declaredLength = sourceResponse.headers.get("Content-Length");
    if (declaredLength && Number(declaredLength) > MAX_BYTES) {
      return {
        content: [
          {
            type: "text",
            text: `Image too large (Content-Length ${declaredLength} bytes, limit ${MAX_BYTES}).`,
          },
        ],
        isError: true,
      };
    }

    const buffer = await sourceResponse.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      return {
        content: [
          {
            type: "text",
            text: `Image too large (${buffer.byteLength} bytes, limit ${MAX_BYTES}).`,
          },
        ],
        isError: true,
      };
    }

    const fileName = deriveFileName(args.imageUrl, contentType, args.fileName);
    const file = new File([buffer], fileName, { type: contentType });

    const result = await MediaService.upload(context, { file });
    if (result.error) {
      return {
        content: [
          {
            type: "text",
            text: `Media record creation failed: ${result.error.reason}`,
          },
        ],
        isError: true,
      };
    }

    const record = result.data;
    const domain = context.env.DOMAIN;
    const absoluteUrl = domain
      ? `https://${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}${record.url}`
      : record.url;

    const output = {
      id: record.id,
      key: record.key,
      url: record.url,
      absoluteUrl,
      fileName: record.fileName,
      mimeType: record.mimeType,
      sizeInBytes: record.sizeInBytes,
      width: record.width,
      height: record.height,
    };

    return {
      content: [
        {
          type: "text",
          text: `Uploaded ${record.fileName} (${record.sizeInBytes} bytes) → ${absoluteUrl}`,
        },
      ],
      structuredContent: output,
    };
  },
});
