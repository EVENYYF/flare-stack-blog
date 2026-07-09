import { Link } from "@tanstack/react-router";
import { Bell, KeyRound, Loader2, LogOut, Shield, UserRound } from "lucide-react";
import type { ProfilePageProps } from "@/features/theme/contract/pages";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { GlassPanel, PageShell } from "../../../components/glass";

export function ProfilePage({
  user,
  profileForm,
  passwordForm,
  notification,
  logout,
}: ProfilePageProps) {
  return (
    <PageShell
      eyebrow="Account"
      title={m.profile_settings()}
      description={m.profile_settings_desc()}
    >
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <GlassPanel className="rounded-[34px] p-6">
          <div className="flex flex-col items-center text-center">
            <div className="overflow-hidden rounded-full border border-white/45 bg-white/25 p-1 shadow-2xl dark:border-white/10 dark:bg-white/10">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="size-24 rounded-full object-cover"
                />
              ) : (
                <div className="grid size-24 place-items-center rounded-full bg-foreground text-3xl font-semibold text-background">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="mt-5 text-2xl font-semibold">{user.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs text-foreground/75 dark:border-white/10 dark:bg-white/10">
              <Shield className="size-3.5" />
              {user.role === "admin"
                ? m.profile_role_admin()
                : m.profile_role_reader()}
            </span>
          </div>

          <div className="mt-8 grid gap-3">
            {user.role === "admin" ? (
              <Link
                to="/admin"
                className="lg-control inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium"
              >
                {m.profile_admin_dashboard()}
              </Link>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/15"
            >
              <LogOut className="size-4" />
              {m.profile_logout()}
            </button>
          </div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel className="rounded-[34px] p-6">
            <SectionTitle icon={<UserRound className="size-5" />}>
              {m.profile_basic_info()}
            </SectionTitle>
            <form onSubmit={profileForm.handleSubmit} className="mt-6 space-y-4">
              <TextField
                label={m.profile_name()}
                error={profileForm.errors.name?.message}
                {...profileForm.register("name")}
              />
              <TextField
                label={m.profile_avatar_url()}
                placeholder="https://..."
                error={profileForm.errors.image?.message}
                {...profileForm.register("image")}
              />
              <SubmitButton isSubmitting={profileForm.isSubmitting}>
                {m.profile_save_changes()}
              </SubmitButton>
            </form>
          </GlassPanel>

          {notification.available ? (
            <GlassPanel className="rounded-[34px] p-6">
              <SectionTitle icon={<Bell className="size-5" />}>
                {m.profile_preferences()}
              </SectionTitle>
              <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-white/25 bg-white/20 p-4 dark:border-white/10 dark:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {m.profile_email_notify()}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {m.profile_email_notify_desc()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={notification.toggle}
                  disabled={notification.isLoading || notification.isPending}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-xs font-medium transition disabled:opacity-60",
                    notification.enabled
                      ? "bg-foreground text-background"
                      : "lg-control text-foreground",
                  )}
                >
                  {notification.enabled
                    ? m.profile_notify_enabled()
                    : m.profile_notify_disabled()}
                </button>
              </div>
            </GlassPanel>
          ) : null}

          {passwordForm ? (
            <GlassPanel className="rounded-[34px] p-6">
              <SectionTitle icon={<KeyRound className="size-5" />}>
                {m.profile_security_settings()}
              </SectionTitle>
              <form onSubmit={passwordForm.handleSubmit} className="mt-6 space-y-4">
                <TextField
                  label={m.profile_current_password()}
                  type="password"
                  error={passwordForm.errors.currentPassword?.message}
                  {...passwordForm.register("currentPassword")}
                />
                <TextField
                  label={m.profile_new_password()}
                  type="password"
                  error={passwordForm.errors.newPassword?.message}
                  {...passwordForm.register("newPassword")}
                />
                <TextField
                  label={m.profile_confirm_password()}
                  type="password"
                  error={passwordForm.errors.confirmPassword?.message}
                  {...passwordForm.register("confirmPassword")}
                />
                <SubmitButton isSubmitting={passwordForm.isSubmitting}>
                  {m.profile_update_password()}
                </SubmitButton>
              </form>
            </GlassPanel>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-semibold">
      <span className="grid size-10 place-items-center rounded-full bg-white/25 text-foreground dark:bg-white/10">
        {icon}
      </span>
      {children}
    </h2>
  );
}

function TextField({
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
        className={cn(
          "mt-2 w-full rounded-full border border-white/30 bg-white/30 px-4 py-3 text-sm outline-none backdrop-blur transition placeholder:text-muted-foreground dark:border-white/10 dark:bg-white/10",
          error && "border-destructive/60",
        )}
      />
      {error ? (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}

function SubmitButton({
  isSubmitting,
  children,
}: {
  isSubmitting: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition active:scale-[0.98] disabled:opacity-60"
    >
      {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
