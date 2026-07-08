import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/common/brand-icon";
import type { LoginPageProps } from "@/features/theme/contract/pages";

export function LoginPage({
  isEmailConfigured,
  loginForm,
  socialLogin,
  turnstileElement,
}: LoginPageProps) {
  return (
    <div>
      <h1 className="text-3xl font-semibold">欢迎回来</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        登录后可以提交友链、管理个人资料。
      </p>

      {isEmailConfigured ? (
        <form onSubmit={loginForm.handleSubmit} className="mt-6 space-y-4">
          {turnstileElement}
          <Field
            label="邮箱"
            type="email"
            error={loginForm.errors.email?.message}
            {...loginForm.register("email")}
          />
          <Field
            label="密码"
            type="password"
            error={loginForm.errors.password?.message}
            {...loginForm.register("password")}
          />
          <button
            type="submit"
            disabled={loginForm.isSubmitting}
            className="w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
          >
            {loginForm.isSubmitting ? "登录中..." : "登录"}
          </button>
        </form>
      ) : null}

      <button
        type="button"
        onClick={socialLogin.handleGithubLogin}
        disabled={socialLogin.isLoading}
        className="lg-control mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium disabled:opacity-60"
      >
        {socialLogin.isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <GithubIcon size={16} />
        )}
        GitHub 登录
      </button>

      <div className="mt-5 flex justify-between text-sm text-muted-foreground">
        <Link to="/forgot-password">忘记密码</Link>
        <Link to="/register">创建账户</Link>
      </div>
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
      {error ? (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
