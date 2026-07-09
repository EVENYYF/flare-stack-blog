import { useRouteContext } from "@tanstack/react-router";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { EmptyState, PageShell, PostCard } from "../../components/glass";

export function HomePage({ posts, pinnedPosts, popularPosts }: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const heroPost = pinnedPosts?.[0] ?? posts[0];
  const restPosts = posts.filter((post) => post.id !== heroPost?.id);

  return (
    <PageShell
      eyebrow={siteConfig.author}
      title={siteConfig.title}
      description={siteConfig.description}
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
