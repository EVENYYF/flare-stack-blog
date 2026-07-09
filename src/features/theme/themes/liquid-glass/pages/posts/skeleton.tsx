export function PostsPageSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-64 lg-shimmer rounded-[34px]"
        />
      ))}
    </div>
  );
}
