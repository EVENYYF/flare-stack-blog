import { Link } from "@tanstack/react-router";
import type { VerifyEmailPageProps } from "@/features/theme/contract/pages";

export function VerifyEmailPage({ status, error }: VerifyEmailPageProps) {
  const title =
    status === "SUCCESS"
      ? "邮箱已验证"
      : status === "ERROR"
        ? "验证失败"
        : "正在验证邮箱";

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-white/30 text-2xl dark:bg-white/10">
        {status === "SUCCESS" ? "✓" : status === "ERROR" ? "!" : "..."}
      </div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      <Link
        to="/login"
        className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
      >
        返回登录
      </Link>
    </div>
  );
}
