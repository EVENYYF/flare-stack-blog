import type { PostsPageProps } from "@/features/theme/contract/pages";
import { EmptyState, PageShell, PostCard } from "../../components/glass";

export function PostsPage({
  posts,
  tags,
  selectedTag,
  onTagClick,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostsPageProps) {
  return (
    <PageShell
      eyebrow="Archive"
      title="文章归档"
      description="用轻量玻璃标签筛选主题，快速进入你想读的内容。"
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => onTagClick(tag.name)}
            className={
              selectedTag === tag.name
                ? "rounded-full bg-foreground px-4 py-2 text-sm text-background"
                : "lg-control rounded-full px-4 py-2 text-sm text-foreground"
            }
          >
            #{tag.name}
            <span className="ml-2 opacity-60">{tag.postCount}</span>
          </button>
        ))}
      </div>

      {posts.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState title="没有匹配的文章" description="换一个标签再试试。" />
      )}

      {hasNextPage ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
            className="lg-glass rounded-full px-6 py-3 text-sm font-medium disabled:opacity-60"
          >
            {isFetchingNextPage ? "加载中..." : "加载更多"}
          </button>
        </div>
      ) : null}
    </PageShell>
  );
}
