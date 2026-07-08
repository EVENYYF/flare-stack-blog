import { Link } from "@tanstack/react-router";
import { LogOut, Menu, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { GlassFilter } from "../components/glass";

export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  // iOS 风格：滚动后导航栏收缩、宽度收窄
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lg-theme-root flex min-h-screen flex-col text-foreground">
      <GlassFilter />
      <header className="sticky top-0 z-50 px-3 py-3 sm:px-6">
        <nav
          className={cn(
            "lg-glass mx-auto flex items-center justify-between rounded-full px-4 transition-all duration-300",
            scrolled ? "h-12 max-w-4xl" : "h-16 max-w-6xl",
          )}
        >
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
              LG
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              Liquid Glass
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navOptions.map((option) => (
              <Link
                key={option.id}
                to={option.to}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/25 hover:text-foreground dark:hover:bg-white/10"
                activeProps={{
                  className:
                    "rounded-full bg-foreground px-4 py-2 text-sm text-background",
                }}
              >
                {option.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isSessionLoading ? (
              <div className="size-9 animate-pulse rounded-full bg-white/30" />
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  className="lg-control hidden rounded-full px-3 py-2 text-sm sm:inline-flex"
                >
                  {user.name}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="lg-control grid size-9 place-items-center rounded-full"
                  aria-label="退出登录"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="lg-control rounded-full px-4 py-2 text-sm font-medium"
              >
                {m.nav_login()}
              </Link>
            )}
            <button
              type="button"
              className="lg-control grid size-9 place-items-center rounded-full md:hidden"
              aria-label="Menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <nav className="fixed inset-x-3 bottom-3 z-50 md:hidden">
        <div className="lg-glass mx-auto grid max-w-md grid-cols-4 rounded-[28px] p-2">
          {navOptions.slice(0, 3).map((option) => (
            <Link
              key={option.id}
              to={option.to}
              className="rounded-2xl px-2 py-3 text-center text-xs text-muted-foreground"
              activeProps={{
                className: "rounded-2xl bg-foreground px-2 py-3 text-center text-xs text-background",
              }}
            >
              {option.label}
            </Link>
          ))}
          <Link
            to={user ? "/profile" : "/login"}
            className="rounded-2xl px-2 py-3 text-center text-xs text-muted-foreground"
          >
            <UserRound className="mx-auto size-4" />
          </Link>
        </div>
      </nav>

      <footer className="px-6 py-12 text-center text-xs text-muted-foreground">
        Built with Flare Stack Blog
      </footer>
    </div>
  );
}
