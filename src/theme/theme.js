/**
 * HVAC Comply design tokens — v2 (redesign).
 *
 * Direction (written before coding, derived from the product):
 * 1. An operations ledger for commercial HVAC equipment — flat white records
 *    on a cool canvas, separated by hairlines. Rules, not boxes.
 * 2. IBM Plex Sans for language, IBM Plex Mono for every identifier, serial,
 *    date and figure — tabular numerals, weights 400–600 only; hierarchy
 *    comes from size and color, not boldness.
 * 3. Deep navy is reserved for headers and chrome; one blue for interactive;
 *    green/amber/red used only for status — never decoration.
 * 4. Sentence-case copy that names real context. No greetings, no hype.
 * 5. Dense, left-aligned rows on a 4px grid; icons only where they label an
 *    action.
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
  // Deep navy — headers and chrome only
  navy900: '#0A1B2E',
  navy800: '#0E2540',
  navy700: '#16324F',

  // One interactive accent
  blue600: '#1D6FD1',
  blue700: '#17599F',
  blue050: '#EDF4FC',

  // Cool neutral ramp (tinted toward the navy world)
  surface: '#FFFFFF',
  canvas: '#F5F7F9',
  canvasSunken: '#EBEEF2',
  hairline: '#E3E7EC',
  hairlineStrong: '#CFD6DE',

  // Text roles — exactly three, plus muted metadata
  textPrimary: '#0F1E30',
  textSecondary: '#4A5A6D',
  textMuted: '#7E8B9B',
  textInverse: '#FFFFFF',
  textOnNavy: '#FFFFFF',
  textOnNavyMuted: '#93A7BD',
  textAccent: '#1D6FD1',

  // Status — semantic only
  success: '#1B7A4B',
  successBg: '#E9F4EE',
  warning: '#8A5A00',
  warningBg: '#FBF1DC',
  danger: '#B3261E',
  dangerBg: '#FAEBEA',
  info: '#1D6FD1',
  infoBg: '#EDF4FC',

  scrim: 'rgba(10, 27, 46, 0.55)',
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
  pill: 999,
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

/** Hairline border shorthand — borders at ~8% ink, no shadows. */
export const borders = {
  hairline: 1,
  color: colors.hairline,
  radius: radius.lg,
};

const theme = { fonts, colors, spacing, radius, typography, textStyles, borders };

export default theme;
