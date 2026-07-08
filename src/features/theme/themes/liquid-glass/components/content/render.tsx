import type { JSONContent } from "@tiptap/react";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import { MathFormula } from "@/components/content/math-formula";
import { extensions } from "@/features/posts/editor/config";
import { CodeBlock } from "./code-block";
import { ImageDisplay } from "./image-display";

export function renderReact(content: JSONContent) {
  return renderToReactElement({
    extensions,
    content,
    options: {
      nodeMapping: {
        image: ({ node }) => {
          const attrs = node.attrs as {
            src: string;
            alt?: string | null;
            width?: number | string;
            height?: number | string;
          };
          const width =
            typeof attrs.width === "string"
              ? Number.parseInt(attrs.width)
              : attrs.width;
          const height =
            typeof attrs.height === "string"
              ? Number.parseInt(attrs.height)
              : attrs.height;

          return (
            <ImageDisplay
              src={attrs.src}
              alt={attrs.alt && attrs.alt !== "null" ? attrs.alt : "image"}
              width={width || undefined}
              height={height || undefined}
            />
          );
        },
        codeBlock: ({ node }) => {
          const attrs = node.attrs as {
            language?: string | null;
            highlightedHtml?: string;
          };
          return (
            <CodeBlock
              code={node.textContent || ""}
              language={attrs.language || null}
              highlightedHtml={attrs.highlightedHtml}
            />
          );
        },
        tableCell: ({ node, children }) => {
          const attrs = node.attrs as { colspan?: number; rowspan?: number };
          return (
            <td colSpan={attrs.colspan} rowSpan={attrs.rowspan}>
              {children}
            </td>
          );
        },
        tableHeader: ({ node, children }) => {
          const attrs = node.attrs as { colspan?: number; rowspan?: number };
          return (
            <th colSpan={attrs.colspan} rowSpan={attrs.rowspan}>
              {children}
            </th>
          );
        },
        inlineMath: ({ node }) => {
          const latex = (node.attrs as { latex?: string }).latex ?? "";
          return <MathFormula latex={latex} mode="inline" />;
        },
        blockMath: ({ node }) => {
          const latex = (node.attrs as { latex?: string }).latex ?? "";
          return <MathFormula latex={latex} mode="block" />;
        },
      },
    },
  });
}
