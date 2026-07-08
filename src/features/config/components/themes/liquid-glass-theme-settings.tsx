import { useFormContext, useWatch } from "react-hook-form";
import { AssetUploadField } from "@/features/config/components/asset-upload-field";
import { RangeField } from "@/features/config/components/site-settings-fields";
import type { SystemConfig } from "@/features/config/config.schema";
import {
  LIQUID_GLASS_THEME_BLUR_MAX,
  LIQUID_GLASS_THEME_BLUR_MIN,
  LIQUID_GLASS_THEME_HUE_MAX,
  LIQUID_GLASS_THEME_HUE_MIN,
  LIQUID_GLASS_THEME_OPACITY_MAX,
  LIQUID_GLASS_THEME_OPACITY_MIN,
} from "@/features/config/site-config.schema";
import { m } from "@/paraglide/messages";

function LiquidGlassPreview() {
  const { control } = useFormContext<SystemConfig>();
  const accentHue = useWatch({
    control,
    name: "site.theme.liquid-glass.accentHue",
  });
  const glassBlur = useWatch({
    control,
    name: "site.theme.liquid-glass.glassBlur",
  });
  const glassOpacity = useWatch({
    control,
    name: "site.theme.liquid-glass.glassOpacity",
  });

  const previewHue =
    typeof accentHue === "number" && !Number.isNaN(accentHue) ? accentHue : 210;
  const previewBlur =
    typeof glassBlur === "number" && !Number.isNaN(glassBlur) ? glassBlur : 28;
  const previewOpacity =
    typeof glassOpacity === "number" && !Number.isNaN(glassOpacity)
      ? glassOpacity
      : 0.58;

  const previewStyle = {
    "--preview-hue": String(previewHue),
    "--preview-blur": `${previewBlur}px`,
    "--preview-opacity": String(previewOpacity),
  } as React.CSSProperties;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/40 p-5 md:col-span-2"
      style={previewStyle}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--preview-hue)_90%_70%/.42),transparent_32%),radial-gradient(circle_at_85%_10%,hsl(184_88%_70%/.32),transparent_34%),linear-gradient(135deg,hsl(210_42%_96%),hsl(230_45%_91%))]" />
      <div className="relative rounded-[1.35rem] border border-white/45 bg-white/[var(--preview-opacity)] p-5 shadow-2xl backdrop-blur-[var(--preview-blur)] dark:border-white/15 dark:bg-slate-950/[var(--preview-opacity)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {m.settings_site_liquid_glass_preview_title()}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {m.settings_site_liquid_glass_preview_desc({
                hue: String(previewHue),
                blur: String(previewBlur),
                opacity: previewOpacity.toFixed(2),
              })}
            </p>
          </div>
          <div
            className="h-10 w-10 shrink-0 rounded-full border border-white/50 shadow-sm"
            style={{ backgroundColor: `hsl(${previewHue} 90% 58%)` }}
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            m.settings_site_liquid_glass_preview_card_one(),
            m.settings_site_liquid_glass_preview_card_two(),
            m.settings_site_liquid_glass_preview_card_three(),
          ].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-white/35 bg-white/25 px-4 py-3 text-xs font-medium text-foreground/80 dark:border-white/10 dark:bg-white/10"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LiquidGlassThemeSettings() {
  const {
    formState: { errors },
  } = useFormContext<SystemConfig>();

  return (
    <>
      <AssetUploadField
        name="site.theme.liquid-glass.homeBg"
        assetPath="themes/liquid-glass/home-bg.webp"
        accept=".png,.webp,.jpg,.jpeg"
        label={m.settings_site_field_home_image()}
        hint={m.settings_site_liquid_glass_home_image_hint()}
        placeholder="/images/asset/themes/liquid-glass/home-bg.webp or https://picsum.photos/1600/900"
        error={errors.site?.theme?.["liquid-glass"]?.homeBg?.message}
      />
      <RangeField
        name="site.theme.liquid-glass.accentHue"
        label={m.settings_site_liquid_glass_accent_hue()}
        hint={m.settings_site_liquid_glass_accent_hue_hint()}
        min={LIQUID_GLASS_THEME_HUE_MIN}
        max={LIQUID_GLASS_THEME_HUE_MAX}
        step={1}
        unit="deg"
        defaultValue={210}
        error={errors.site?.theme?.["liquid-glass"]?.accentHue?.message}
      />
      <RangeField
        name="site.theme.liquid-glass.glassBlur"
        label={m.settings_site_liquid_glass_blur()}
        hint={m.settings_site_liquid_glass_blur_hint()}
        min={LIQUID_GLASS_THEME_BLUR_MIN}
        max={LIQUID_GLASS_THEME_BLUR_MAX}
        step={1}
        unit="px"
        defaultValue={28}
        error={errors.site?.theme?.["liquid-glass"]?.glassBlur?.message}
      />
      <RangeField
        name="site.theme.liquid-glass.glassOpacity"
        label={m.settings_site_liquid_glass_opacity()}
        hint={m.settings_site_liquid_glass_opacity_hint()}
        min={LIQUID_GLASS_THEME_OPACITY_MIN}
        max={LIQUID_GLASS_THEME_OPACITY_MAX}
        step={0.01}
        defaultValue={0.58}
        formatValue={(value) => value.toFixed(2)}
        error={errors.site?.theme?.["liquid-glass"]?.glassOpacity?.message}
      />
      <LiquidGlassPreview />
    </>
  );
}
