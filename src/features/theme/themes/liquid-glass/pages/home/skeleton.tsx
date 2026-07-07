export function HomePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-36 max-w-2xl animate-pulse rounded-[34px] bg-white/25 dark:bg-white/10" />
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="h-80 animate-pulse rounded-[34px] bg-white/25 dark:bg-white/10" />
        <div className="grid gap-5">
          <div className="h-36 animate-pulse rounded-[34px] bg-white/25 dark:bg-white/10" />
          <div className="h-36 animate-pulse rounded-[34px] bg-white/25 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
