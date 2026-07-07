import ZoomableImage from "@/features/theme/themes/default/components/content/zoomable-image";

export function ImageDisplay({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-[30px] border border-white/35 bg-white/20 shadow-2xl dark:border-white/10 dark:bg-white/10">
        <ZoomableImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full object-cover"
        />
      </div>
      {alt ? (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  );
}
