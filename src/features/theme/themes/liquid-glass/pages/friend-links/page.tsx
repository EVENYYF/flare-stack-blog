import type { FriendLinksPageProps } from "@/features/theme/contract/pages";
import { EmptyState, PageShell } from "../../components/glass";

export function FriendLinksPage({ links }: FriendLinksPageProps) {
  return (
    <PageShell
      eyebrow="Links"
      title="友链"
      description="像玻璃组件一样轻盈排列的朋友站点。"
    >
      {links.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="lg-glass block rounded-[30px] p-6 transition hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                {link.logoUrl ? (
                  <img
                    src={link.logoUrl}
                    alt=""
                    className="size-12 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="grid size-12 place-items-center rounded-2xl bg-foreground text-background">
                    {link.siteName.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">
                    {link.siteName}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">
                    {link.siteUrl}
                  </p>
                </div>
              </div>
              {link.description ? (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {link.description}
                </p>
              ) : null}
            </a>
          ))}
        </div>
      ) : (
        <EmptyState title="暂无友链" description="审核通过的友链会显示在这里。" />
      )}
    </PageShell>
  );
}
