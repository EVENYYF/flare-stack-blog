export function FriendLinksPageSkeleton() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-[30px] bg-white/25 dark:bg-white/10"
        />
      ))}
    </div>
  );
}
