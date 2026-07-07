import { Link } from "@tanstack/react-router";
import type { UserLayoutProps } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";

export function UserLayout({ isAuthenticated, children }: UserLayoutProps) {
  return (
    <div className="lg-theme-root min-h-screen">
      {isAuthenticated ? (
        <main>{children}</main>
      ) : (
        <main className="flex min-h-screen items-center justify-center px-4">
          <section className="lg-glass max-w-md rounded-[34px] p-8 text-center">
            <h1 className="text-3xl font-semibold">
              {m.auth_layout_login_required()}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {m.auth_layout_login_required_desc()}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/login"
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
              >
                {m.auth_layout_go_to_login()}
              </Link>
              <Link
                to="/"
                className="lg-control rounded-full px-5 py-2 text-sm font-medium"
              >
                {m.auth_layout_back_home()}
              </Link>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
