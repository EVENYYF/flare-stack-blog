import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock3 } from "lucide-react";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { cn, formatDate } from "@/lib/utils";

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("lg-glass", className)}>{children}</div>;
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <GlassPanel className="rounded-[28px] px-6 py-10 text-center">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </GlassPanel>
  );
}

export function PostCard({
  post,
  featured = false,
}: {
  post: PostItem;
  featured?: boolean;
}) {
  return (
    <Link
      to="/post/$slug"
      params={{ slug: post.slug }}
      className={cn(
        "group block rounded-[30px] p-[1px] transition duration-500",
        "hover:-translate-y-1 hover:shadow-[0_30px_90px_hsl(var(--lg-accent-hue)_70%_25%/0.2)]",
      )}
    >
      <article
        className={cn(
          "lg-glass h-full rounded-[29px] p-6",
          featured && "md:min-h-80 md:p-8",
        )}
        style={{ viewTransitionName: `post-card-${post.slug}` }}
      >
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {post.readTimeInMinutes} min
          </span>
        </div>

        <h2
          className={cn(
            "mt-5 text-balance font-semibold leading-tight text-foreground",
            featured ? "text-3xl md:text-5xl" : "text-2xl",
          )}
        >
          {post.title}
        </h2>

        {post.summary ? (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
            {post.summary}
          </p>
        ) : null}

        {post.tags?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-white/35 bg-white/25 px-3 py-1 text-xs text-foreground/80 dark:border-white/10 dark:bg-white/10"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}
      </article>
    </Link>
  );
}

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
