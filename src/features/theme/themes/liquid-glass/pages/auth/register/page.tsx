import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import type { RegisterPageProps } from "@/features/theme/contract/pages";

export function RegisterPage({
  isEmailConfigured,
  registerForm,
  turnstileElement,
}: RegisterPageProps) {
  if (!isEmailConfigured) {
    return (
      <div>
        <h1 className="text-3xl font-semibold">暂未开放注册</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          当前站点没有配置邮件服务，请使用第三方登录。
        </p>
        <Link
          to="/login"
          className="lg-control mt-6 inline-flex rounded-full px-5 py-3 text-sm font-medium"
        >
          返回登录
        </Link>
      </div>
    );
  }

  if (registerForm.isSuccess) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12 text-foreground/70" />
        <h1 className="mt-4 text-2xl font-semibold">验证邮件已发送</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          请前往邮箱点击验证链接完成注册。
        </p>
        <Link
          to="/login"
          className="lg-control mt-6 inline-flex rounded-full px-5 py-3 text-sm font-medium"
        >
          返回登录
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">创建账户</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        注册后即可评论与提交友链。
      </p>

      <form onSubmit={registerForm.handleSubmit} className="mt-6 space-y-4">
        {turnstileElement}
        <Field
          label="昵称"
          error={registerForm.errors.name?.message}
          {...registerForm.register("name")}
        />
        <Field
          label="邮箱"
          type="email"
          error={registerForm.errors.email?.message}
          {...registerForm.register("email")}
        />
        <Field
          label="密码"
          type="password"
          error={registerForm.errors.password?.message}
          {...registerForm.register("password")}
        />
        <Field
          label="确认密码"
          type="password"
          error={registerForm.errors.confirmPassword?.message}
          {...registerForm.register("confirmPassword")}
        />
        <button
          type="submit"
          disabled={registerForm.isSubmitting || registerForm.turnstilePending}
          className="w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition active:scale-[0.98] disabled:opacity-60"
        >
          {registerForm.isSubmitting ? "创建中..." : "注册"}
        </button>
      </form>

      <div className="mt-5 flex justify-end text-sm text-muted-foreground">
        <Link to="/login">已有账户？去登录</Link>
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
        className="mt-2 w-full rounded-full border border-white/30 bg-white/30 px-4 py-3 outline-none transition focus:border-white/60 focus:bg-white/40 dark:border-white/10 dark:bg-white/10 dark:focus:border-white/25 dark:focus:bg-white/15"
      />
      {error ? (
        <span className="mt-1 block text-xs text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
