/**
 * HVAC Comply design tokens — v3 (premium light SaaS).
 *
 * Direction (research-first; sources: Stripe/Linear/Vercel craft writeups,
 * frontend-design-saas light-mode tokens, light-theme design guides):
 * 1. Light by default: cool off-white canvas (#F8FAFC), white surfaces that
 *    lift off it with 1px hairlines — depth from tint shifts, not decoration.
 * 2. Ink, not black: primary text is deep navy (#0F1E30) — Stripe's
 *    navy-not-black rule — on white for editorial calm and AA contrast.
 * 3. One interactive accent (#1D6FD1) earns buttons, links, focus rings and
 *    selected states; its soft tint (#EDF4FC) fills selected surfaces.
 *    Green/amber/red appear only as soft status tints — never decoration.
 * 4. IBM Plex Sans (language) + IBM Plex Mono (identifiers, dates, figures,
 *    tabular). Hierarchy from size and color; weights 400–600 only.
 * 5. Shadows are reserved for genuinely floating layers (bottom sheets,
 *    sticky action bar, the login card) — tight, low, single-direction.
 *    Content cards stay flat: white + hairline.
 * 6. Sentence-case copy on a 4px grid; radius 6–12 (never pill buttons —
 *    pills belong to status tags only).
 */

import { Platform } from 'react-native';

/* ---- Font families (loaded in app/_layout.js; weight is in the name) ----
 * On web each family carries an explicit fallback stack: if the Plex file
 * is slow or blocked, text renders in a clean system sans/mono — never the
 * browser's Times serif default. Native keeps the exact family name. */
const sansFallback = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const monoFallback = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

const family = (name, fallback) => (Platform.OS === 'web' ? `${name}, ${fallback}` : name);

export const fonts = {
  regular: family('IBMPlexSans_400Regular', sansFallback),
  medium: family('IBMPlexSans_500Medium', sansFallback),
  semibold: family('IBMPlexSans_600SemiBold', sansFallback),
  mono: family('IBMPlexMono_400Regular', monoFallback),
  monoMedium: family('IBMPlexMono_500Medium', monoFallback),
  monoSemibold: family('IBMPlexMono_600SemiBold', monoFallback),
};

export const colors = {
  // Ink fills — avatar, dark accents (never a page background in v3)
  navy900: '#0A1B2E',
  navy800: '#0E2540',
  navy700: '#16324F',

  // One interactive accent + its soft tint
  blue600: '#1D6FD1',
  blue700: '#17599F',
  blue050: '#EDF4FC',

  // Cool neutral ramp (slate) — canvas is one step below white
  surface: '#FFFFFF',
  canvas: '#F8FAFC',
  canvasSunken: '#F2F4F7',
  hairline: '#E4E7EC',
  hairlineStrong: '#D0D5DD',

  // Text roles — ink is navy-not-black; exactly three, plus muted metadata
  textPrimary: '#0F1E30',
  textSecondary: '#475467',
  textMuted: '#7E8B9B',
  textInverse: '#FFFFFF',
  textOnNavy: '#FFFFFF',
  textOnNavyMuted: '#93A7BD',
  textAccent: '#1D6FD1',

  // Status — soft semantic tints only (bg + ink pairs)
  success: '#1B7A4B',
  successBg: '#E9F4EE',
  warning: '#8A5A00',
  warningBg: '#FBF1DC',
  danger: '#B3261E',
  dangerBg: '#FAEBEA',
  info: '#1D6FD1',
  infoBg: '#EDF4FC',

  scrim: 'rgba(10, 27, 46, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  pill: 999,
};

/**
 * Elevation — floating layers only (research rule: content cards are flat).
 * Tight, low, single-direction; no glows, no colored shadows.
 */
export const shadows = {
  /** Login card, floating panels */
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  /** Bottom sheets and modals */
  sheet: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 18,
    elevation: 16,
  },
  /** Sticky action bar */
  bar: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 12,
  },
};

export const typography = {
  sizeMeta: 11,
  sizeCaption: 12,
  sizeBodySmall: 13,
  sizeBody: 14,
  sizeBodyLarge: 16,
  sizeTitle: 18,
  sizeHeading: 23,
  sizeDisplay: 30,
  sizeMetric: 26,
};

/**
 * Named text styles — screens reference these instead of repeating values.
 * fontFamily carries the weight; no separate fontWeight keys.
 */
export const textStyles = {
  display: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizeDisplay,
    letterSpacing: -0.6,
    color: colors.textPrimary,
  },
  heading: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizeHeading,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: typography.sizeTitle,
    letterSpacing: -0.2,
    color: colors.textPrimary,
  },
  bodyLarge: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBodyLarge,
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBody,
    color: colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: typography.sizeBody,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBodySmall,
    color: colors.textSecondary,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: typography.sizeCaption,
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
  },
  /** Micro metadata — mono, uppercase allowed ONLY for real data labels */
  meta: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 0.6,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  /** Every identifier, serial, date and figure */
  mono: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeBody,
    letterSpacing: 0.2,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  monoSmall: {
    fontFamily: fonts.mono,
    fontSize: typography.sizeCaption,
    letterSpacing: 0.2,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  metric: {
    fontFamily: fonts.monoSemibold,
    fontSize: typography.sizeMetric,
    letterSpacing: -0.4,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
};

/** Hairline border shorthand — borders, not elevation. */
export const borders = {
  hairline: 1,
  color: colors.hairline,
  radius: radius.lg,
};

const theme = { fonts, colors, spacing, radius, shadows, typography, textStyles, borders };

export default theme;
