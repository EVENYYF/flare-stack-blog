import { ArrowLeft, Search } from "lucide-react";
import type { SearchPageProps } from "@/features/theme/contract/pages";
import { EmptyState, GlassPanel, PageShell } from "../../components/glass";

export function SearchPage({
  query,
  results,
  isSearching,
  onQueryChange,
  onSelectPost,
  onBack,
}: SearchPageProps) {
  return (
    <PageShell
      eyebrow="Spotlight"
      title="搜索文章"
      description="输入关键词，快速定位标题、摘要和正文片段。"
    >
      <GlassPanel className="rounded-[34px] p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="lg-control grid size-11 shrink-0 place-items-center rounded-full"
            aria-label="返回"
          >
            <ArrowLeft className="size-4" />
          </button>
          <Search className="size-5 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            autoFocus
            placeholder="搜索标题、摘要或正文..."
            className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
        </div>
      </GlassPanel>

      <div className="mt-6 space-y-3">
        {isSearching ? (
          <EmptyState title="正在搜索" description="正在从索引中匹配结果。" />
        ) : results.length ? (
          results.map((item) => (
            <button
              key={item.post.id}
              type="button"
              onClick={() => onSelectPost(item.post.slug)}
              className="lg-glass block w-full rounded-[28px] p-5 text-left transition hover:-translate-y-0.5"
            >
              <h2 className="text-xl font-semibold">{item.post.title}</h2>
              {item.matches.contentSnippet || item.post.summary ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {item.matches.contentSnippet || item.post.summary}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {item.post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </button>
          ))
        ) : query ? (
          <EmptyState title="没有结果" description="换一个关键词试试。" />
        ) : null}
      </div>
    </PageShell>
  );
}
