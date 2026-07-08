export function HomePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-36 max-w-2xl lg-shimmer rounded-[34px]" />
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="h-80 lg-shimmer rounded-[34px]" />
        <div className="grid gap-5">
          <div className="h-36 lg-shimmer rounded-[34px]" />
          <div className="h-36 lg-shimmer rounded-[34px]" />
        </div>
      </div>
    </div>
  );
}
