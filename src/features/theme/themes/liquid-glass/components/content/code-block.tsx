import { Check, Copy } from "lucide-react";
import { memo, useState } from "react";
import { m } from "@/paraglide/messages";

interface CodeBlockProps {
  code: string;
  language: string | null;
  highlightedHtml?: string;
}

export const CodeBlock = memo(
  ({ code, language, highlightedHtml }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);
    const html =
      highlightedHtml ||
      `<pre class="shiki"><code>${code.replaceAll("<", "&lt;")}</code></pre>`;

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };

    return (
      <div className="my-10 overflow-hidden rounded-[26px] border border-white/30 bg-zinc-950/90 shadow-2xl dark:border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/55">
            {language || m.common_plain_text()}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white/75 transition hover:bg-white/15 hover:text-white"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? m.common_copied() : m.common_copy_code()}
          </button>
        </div>
        <div
          className="overflow-x-auto p-5 text-sm leading-7 [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  },
);
