import { blogConfig } from "@/blog.config";
import type { SiteConfig } from "@/features/config/site-config.schema";

export function getLiquidGlassThemeStyle(
  siteConfig?: SiteConfig,
): React.CSSProperties {
  const theme = siteConfig?.theme["liquid-glass"] ?? blogConfig.theme["liquid-glass"];

  return {
    "--lg-accent-hue": String(theme.accentHue),
    "--lg-bg-image": theme.homeBg ? `url("${theme.homeBg}")` : "none",
    "--lg-glass-blur": `${theme.glassBlur}px`,
    "--lg-glass-opacity": String(theme.glassOpacity),
  } as React.CSSProperties;
}
