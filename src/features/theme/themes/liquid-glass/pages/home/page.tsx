import type { HomePageProps } from "@/features/theme/contract/pages";
import { EmptyState, PageShell, PostCard } from "../../components/glass";

export function HomePage({ posts, pinnedPosts, popularPosts }: HomePageProps) {
  const heroPost = pinnedPosts?.[0] ?? posts[0];
  const restPosts = posts.filter((post) => post.id !== heroPost?.id);

  return (
    <PageShell
      eyebrow="Liquid Journal"
      title="像 iPhone 玻璃一样轻盈的阅读界面"
      description="半透明层级承载导航和信息卡片，正文保持清晰，让视觉氛围服务于阅读。"
    >
      {heroPost ? (
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <PostCard post={heroPost} featured />
          <div className="grid gap-5">
            {(pinnedPosts?.slice(1, 3) ?? popularPosts?.slice(0, 2) ?? [])
              .filter((post) => post.id !== heroPost.id)
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
          </div>
        </div>
      ) : (
        <EmptyState title="暂无文章" description="发布第一篇文章后会显示在这里。" />
      )}

      {restPosts.length ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {restPosts.slice(0, 6).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}
    </PageShell>
  );
}
