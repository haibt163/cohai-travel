import { cn } from "@/lib/utils";

export function Cover({
  src,
  alt,
  className,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const fallback = src.replace(/\.jpe?g(\?.*)?$/i, ".svg");

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={cn("h-full w-full object-cover", className)}
      onError={(event) => {
        const node = event.currentTarget;
        if (fallback !== src && node.src !== fallback) {
          node.src = fallback;
        }
      }}
    />
  );
}
