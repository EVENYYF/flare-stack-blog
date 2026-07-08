import { ArrowLeft } from "lucide-react";
import type { AuthLayoutProps } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";

export function AuthLayout({ onBack, children }: AuthLayoutProps) {
  return (
    <div className="lg-theme-root flex min-h-screen flex-col px-4 py-4">
      <header>
        <button
          type="button"
          onClick={onBack}
          className="lg-control inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
        >
          <ArrowLeft className="size-4" />
          {m.auth_layout_back_home()}
        </button>
      </header>
      <main className="flex flex-1 items-center justify-center py-10">
        <div className="lg-glass w-full max-w-md rounded-[34px] p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
