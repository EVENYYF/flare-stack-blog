import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock3 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { cn, formatDate } from "@/lib/utils";

/**
 * 透镜位移图：R 通道编码 X 位移、G 通道编码 Y 位移，中心用 (128,128) 中性色
 * 径向罩住 → 只有边缘 ~28% 区域产生折射，中心完全通透（Apple 透镜质感的关键）。
 */
const DISPLACEMENT_MAP = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">' +
    "<defs>" +
    '<linearGradient id="gx" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#ff0000"/><stop offset="1" stop-color="#000000"/></linearGradient>' +
    '<linearGradient id="gy" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#00ff00"/><stop offset="1" stop-color="#000000"/></linearGradient>' +
    '<radialGradient id="c" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stop-color="#808000"/><stop offset="0.72" stop-color="#808000"/><stop offset="1" stop-color="#808000" stop-opacity="0"/></radialGradient>' +
    "</defs>" +
    '<rect width="128" height="128" fill="url(#gx)"/>' +
    '<rect width="128" height="128" fill="url(#gy)" style="mix-blend-mode:screen"/>' +
    '<rect width="128" height="128" fill="url(#c)"/>' +
    "</svg>",
)}`;

/**
 * SVG 透镜折射滤镜 + Chromium 检测。
 * backdrop-filter: url(#lg-refraction) 目前仅 Chromium 系可用（Safari 不解析、
 * Firefox 解析但不渲染），故通过 UA 检测后在 <html> 上加 .lg-refract 开启。
 * R/G/B 三个通道用不同位移强度分别折射再合成 → 边缘产生真实色散。
 */
export function GlassFilter() {
  useEffect(() => {
    if (/Chrom(e|ium)/.test(navigator.userAgent)) {
      document.documentElement.classList.add("lg-refract");
    }
    return () => document.documentElement.classList.remove("lg-refract");
  }, []);

  return (
    <svg aria-hidden="true" className="absolute size-0 overflow-hidden">
      <defs>
        <filter
          id="lg-refraction"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={DISPLACEMENT_MAP}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="map"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="36"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispR"
          />
          <feColorMatrix
            in="dispR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="chR"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="42"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispG"
          />
          <feColorMatrix
            in="dispG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="chG"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="48"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispB"
          />
          <feColorMatrix
            in="dispB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="chB"
          />
          <feComposite
            in="chR"
            in2="chG"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="chRG"
          />
          <feComposite
            in="chRG"
            in2="chB"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("lg-glass", className)}>{children}</div>;
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <GlassPanel className="rounded-[28px] px-6 py-10 text-center">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </GlassPanel>
  );
}

export function PostCard({
  post,
  featured = false,
}: {
  post: PostItem;
  featured?: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  // 鼠标跟随：光晕位置（--lg-mx/--lg-my）+ 轻微 3D 倾斜（±5°）
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      card.style.setProperty("--lg-mx", `${x * 100}%`);
      card.style.setProperty("--lg-my", `${y * 100}%`);
      card.style.transform = `perspective(1000px) rotateX(${(y - 0.5) * -10}deg) rotateY(${(x - 0.5) * 10}deg) translateZ(8px)`;
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);

  return (
    <Link
      ref={cardRef}
      to="/post/$slug"
      params={{ slug: post.slug }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "lg-glass-interactive group block rounded-[30px]",
        "hover:shadow-[0_30px_90px_hsl(var(--lg-accent-hue)_70%_25%/0.2)]",
      )}
    >
      <article
        className={cn(
          "lg-glass lg-vt-hero h-full rounded-[29px] p-6",
          featured && "md:min-h-80 md:p-8",
        )}
        style={{ viewTransitionName: `post-hero-${post.slug}` }}
      >
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {post.readTimeInMinutes} min
          </span>
        </div>

        <h2
          className={cn(
            "mt-5 text-balance font-semibold leading-tight text-foreground",
            featured ? "text-3xl md:text-5xl" : "text-2xl",
          )}
        >
          {post.title}
        </h2>

        {post.summary ? (
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted-foreground">
            {post.summary}
          </p>
        ) : null}

        {post.tags?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-white/35 bg-white/25 px-3 py-1 text-xs text-foreground/80 dark:border-white/10 dark:bg-white/10"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}
      </article>
    </Link>
  );
}

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
