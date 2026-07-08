import { Turnstile } from "@/components/common/turnstile";
import type { SubmitFriendLinkPageProps } from "@/features/theme/contract/pages";
import { GlassPanel, PageShell } from "../../components/glass";

export function SubmitFriendLinkPage({
  myLinks,
  form,
}: SubmitFriendLinkPageProps) {
  return (
    <PageShell
      eyebrow="Submit"
      title="提交友链"
      description="填写站点信息，审核通过后会展示在友链页面。"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <GlassPanel className="rounded-[34px] p-6">
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <Turnstile {...form.turnstileProps} />
            <Input
              label="站点名称"
              error={form.errors.siteName?.message}
              {...form.register("siteName")}
            />
            <Input
              label="站点地址"
              error={form.errors.siteUrl?.message}
              {...form.register("siteUrl")}
            />
            <Input
              label="Logo 地址"
              error={form.errors.logoUrl?.message}
              {...form.register("logoUrl")}
            />
            <Input
              label="联系邮箱"
              error={form.errors.contactEmail?.message}
              {...form.register("contactEmail")}
            />
            <label className="block">
              <span className="text-sm font-medium">站点描述</span>
              <textarea
                {...form.register("description")}
                className="mt-2 min-h-28 w-full rounded-3xl border border-white/30 bg-white/30 px-4 py-3 outline-none backdrop-blur dark:border-white/10 dark:bg-white/10"
              />
              {form.errors.description?.message ? (
                <span className="mt-1 block text-xs text-destructive">
                  {form.errors.description.message}
                </span>
              ) : null}
            </label>
            <button
              type="submit"
              disabled={form.isSubmitting}
              className="w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
            >
              {form.isSubmitting ? "提交中..." : "提交审核"}
            </button>
          </form>
        </GlassPanel>

        <GlassPanel className="rounded-[34px] p-6">
          <h2 className="text-xl font-semibold">我的提交</h2>
          <div className="mt-4 space-y-3">
            {myLinks.length ? (
              myLinks.map((link) => (
                <div
                  key={link.id}
                  className="rounded-3xl border border-white/25 bg-white/20 p-4 text-sm dark:border-white/10 dark:bg-white/10"
                >
                  <div className="font-medium">{link.siteName}</div>
                  <div className="text-muted-foreground">{link.status}</div>
                  {link.rejectionReason ? (
                    <div className="mt-2 text-destructive">
                      {link.rejectionReason}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">暂无提交记录。</p>
            )}
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  );
}

function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-full border border-white/30 bg-white/30 px-4 py-3 outline-none backdrop-blur dark:border-white/10 dark:bg-white/10"
      />
      {error ? (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
