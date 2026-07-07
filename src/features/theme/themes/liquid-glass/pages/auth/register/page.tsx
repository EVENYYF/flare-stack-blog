import { Link } from "@tanstack/react-router";
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
          className="mt-6 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background"
        >
          返回登录
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">创建账户</h1>
      <form onSubmit={registerForm.handleSubmit} className="mt-6 space-y-4">
        {turnstileElement}
        <Field label="昵称" error={registerForm.errors.name?.message} {...registerForm.register("name")} />
        <Field label="邮箱" type="email" error={registerForm.errors.email?.message} {...registerForm.register("email")} />
        <Field label="密码" type="password" error={registerForm.errors.password?.message} {...registerForm.register("password")} />
        <Field label="确认密码" type="password" error={registerForm.errors.confirmPassword?.message} {...registerForm.register("confirmPassword")} />
        <button
          type="submit"
          disabled={registerForm.isSubmitting}
          className="w-full rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-60"
        >
          {registerForm.isSubmitting ? "创建中..." : "注册"}
        </button>
      </form>
      {registerForm.isSuccess ? (
        <p className="mt-4 text-sm text-muted-foreground">注册成功，请检查邮箱。</p>
      ) : null}
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
