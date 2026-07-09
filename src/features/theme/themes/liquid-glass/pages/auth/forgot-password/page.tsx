import { Link } from "@tanstack/react-router";
import type { ForgotPasswordPageProps } from "@/features/theme/contract/pages";

export function ForgotPasswordPage({
  forgotPasswordForm,
  turnstileElement,
}: ForgotPasswordPageProps) {
  return (
    <div>
      <h1 className="text-3xl font-semibold">找回密码</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        输入邮箱后，我们会发送重置链接。
      </p>
      {forgotPasswordForm.isSent ? (
        <div className="mt-6 rounded-3xl bg-white/25 p-4 text-sm dark:bg-white/10">
          重置邮件已发送至 {forgotPasswordForm.sentEmail}
        </div>
      ) : (
        <form onSubmit={forgotPasswordForm.handleSubmit} className="mt-6 space-y-4">
          {turnstileElement}
          <label className="block">
            <span className="text-sm font-medium">邮箱</span>
            <input
              type="email"
              {...forgotPasswordForm.register("email")}
              className="mt-2 w-full rounded-full border border-white/30 bg-white/30 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10"
            />
            {forgotPasswordForm.errors.email?.message ? (
              <span className="mt-1 block text-xs text-destructive">
                {forgotPasswordForm.errors.email.message}
              </span>
            ) : null}
          </label>
          <button
            type="submit"
            disabled={forgotPasswordForm.isSubmitting}
            className="w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
          >
            {forgotPasswordForm.isSubmitting ? "发送中..." : "发送重置链接"}
          </button>
        </form>
      )}
      <Link to="/login" className="mt-5 inline-flex text-sm text-muted-foreground">
        返回登录
      </Link>
    </div>
  );
}
