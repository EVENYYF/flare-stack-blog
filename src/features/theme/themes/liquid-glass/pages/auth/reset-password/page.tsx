import { Link } from "@tanstack/react-router";
import type { ResetPasswordPageProps } from "@/features/theme/contract/pages";

export function ResetPasswordPage({
  resetPasswordForm,
  token,
  error,
}: ResetPasswordPageProps) {
  if (!token || error) {
    return (
      <div>
        <h1 className="text-3xl font-semibold">链接不可用</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {error || "重置链接缺少必要参数。"}
        </p>
        <Link to="/forgot-password" className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
          重新发送
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">设置新密码</h1>
      <form onSubmit={resetPasswordForm.handleSubmit} className="mt-6 space-y-4">
        <Field label="新密码" type="password" error={resetPasswordForm.errors.password?.message} {...resetPasswordForm.register("password")} />
        <Field label="确认密码" type="password" error={resetPasswordForm.errors.confirmPassword?.message} {...resetPasswordForm.register("confirmPassword")} />
        <button
          type="submit"
          disabled={resetPasswordForm.isSubmitting}
          className="w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
        >
          {resetPasswordForm.isSubmitting ? "保存中..." : "更新密码"}
        </button>
      </form>
    </div>
  );
}

function Field({
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
        className="mt-2 w-full rounded-full border border-white/30 bg-white/30 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10"
      />
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
