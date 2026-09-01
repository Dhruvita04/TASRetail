import type { BankThemeInput, BankTheme } from './Banktheme.types';

// --- small color-math helpers ---

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
    .toString(16)
    .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function withOpacityOverWhite(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    r * alpha + 255 * (1 - alpha),
    g * alpha + 255 * (1 - alpha),
    b * alpha + 255 * (1 - alpha)
  );
}

// WCAG relative luminance — decides readable text color
function contrastText(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? '#000000' : '#FFFFFF';
}

function deriveAccent(primary: string): string {
  // simple fallback: rotate hue by darkening + no dedicated accent given
  return darken(primary, -0.15 < 0 ? 0.15 : 0.15);
}

// --- the function every ThemeProvider call goes through ---

export function deriveTheme(input: BankThemeInput): BankTheme {
  const primary = input.colors.primary;
  const accent = input.colors.accent ?? deriveAccent(primary);

  return {
    sourceid: input.sourceid,
    bankName: input.bankName,
    logoUrl: input.logoUrl,
    primary,
    primaryHover: darken(primary, 0.10),
    primaryActive: darken(primary, 0.18),
    primaryDisabled: withOpacityOverWhite(primary, 0.4),
    textOnPrimary: contrastText(primary),
    accent,
    accentFocusRing: withOpacityOverWhite(accent, 0.25),
  };
}
