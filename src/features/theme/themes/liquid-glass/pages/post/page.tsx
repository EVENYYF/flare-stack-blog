import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock3, Share2 } from "lucide-react";
import { Suspense } from "react";
import { toast } from "sonner";
import type { PostPageProps } from "@/features/theme/contract/pages";
import {
  RelatedPosts,
  RelatedPostsSkeleton,
} from "@/features/theme/themes/default/pages/post/components/related-posts";
import TableOfContents from "@/features/theme/themes/default/pages/post/components/table-of-contents";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { BackToTop } from "../../components/glass";
import { CommentSection } from "../../components/comments/view/comment-section";
import { ContentRenderer } from "../../components/content/content-renderer";

export function PostPage({ post }: PostPageProps) {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8">
        <Link
          to="/posts"
          className="lg-control inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
        >
          <ArrowLeft className="size-4" />
          {m.post_back_to_list()}
        </Link>
      </nav>

      <header
        className="lg-glass lg-vt-hero rounded-[38px] p-6 sm:p-10"
        style={{ viewTransitionName: `post-hero-${post.slug}` }}
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4" />
            {post.readTimeInMinutes} min
          </span>
        </div>
        <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight md:text-6xl">
          {post.title}
        </h1>
        {post.summary ? (
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {post.summary}
          </p>
        ) : null}
        {post.tags?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                to="/posts"
                search={{ tagName: tag.name }}
                className="lg-control rounded-full px-3 py-1.5 text-xs"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <div className="relative mt-8">
        <aside className="absolute left-full top-0 ml-10 hidden h-full xl:block">
          <div className="lg-glass sticky top-28 max-h-[calc(100vh-9rem)] w-60 overflow-y-auto rounded-[26px] p-5">
            <TableOfContents headers={post.toc} />
          </div>
        </aside>

        <div className="rounded-[34px] bg-background/88 px-5 py-8 shadow-2xl ring-1 ring-white/35 backdrop-blur-sm dark:bg-background/72 dark:ring-white/10 sm:px-10">
          <ContentRenderer content={post.contentJson} />
        </div>
      </div>

      <footer className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => toast.success(m.post_share_success()))
              .catch(() => toast.error(m.post_share_error()));
          }}
          className="lg-control inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
        >
          <Share2 className="size-4" />
          {m.post_share()}
        </button>
      </footer>

      <section className="lg-glass mt-10 rounded-[34px] p-6 sm:p-10">
        <Suspense fallback={<RelatedPostsSkeleton />}>
          <RelatedPosts slug={post.slug} />
        </Suspense>
      </section>

      <section className="lg-glass mt-10 rounded-[34px] p-6 sm:p-10">
        <CommentSection postId={post.id} />
      </section>

      <BackToTop />
    </article>
  );
}
