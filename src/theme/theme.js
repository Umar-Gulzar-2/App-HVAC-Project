/**
 * HVAC Comply design system — single source of truth for visual style.
 * Direction: deep navy foundation, restrained blue accents, clean neutral
 * surfaces, strong typography, consistent spacing, subtle elevation.
 */

export const colors = {
  // Deep navy foundation (headers, dark surfaces, headings)
  navy900: '#0A1B2E',
  navy800: '#0E2540',
  navy700: '#15314F',
  navy600: '#1D4066',

  // Restrained blue accent (primary actions, links, focus)
  blue600: '#1D6FD1',
  blue700: '#17599F',
  blue500: '#3B8AE6',
  blue050: '#EAF3FD',

  // Clean neutral surfaces
  surface: '#FFFFFF',
  surfaceAlt: '#F5F7FA',
  surfaceSunken: '#EDF1F6',
  border: '#DCE3EC',
  borderStrong: '#C3CEDB',

  // Text hierarchy
  textPrimary: '#10243E',
  textSecondary: '#4E5F73',
  textMuted: '#8494A6',
  textInverse: '#FFFFFF',
  textOnNavy: '#FFFFFF',
  textOnNavyMuted: '#9DB1C7',

  // Status colors (purposeful, never decorative)
  success: '#1B7A4B',
  successBg: '#E6F4EC',
  warning: '#8A5A00',
  warningBg: '#FFF3DC',
  danger: '#B3261E',
  dangerBg: '#FBEAE8',
  info: '#1D6FD1',
  infoBg: '#EAF3FD',
  neutral: '#4E5F73',
  neutralBg: '#EDF1F6',

  // Overlays
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
  lg: 12,
  pill: 999,
};

export const typography = {
  // Sizes
  sizeOverline: 11,
  sizeCaption: 12,
  sizeBodySmall: 13,
  sizeBody: 15,
  sizeBodyLarge: 17,
  sizeTitle: 20,
  sizeHeading: 24,
  sizeDisplay: 30,
  sizeStat: 32,
  // Weights
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  // Line heights
  leadingTight: 20,
  leadingNormal: 22,
  leadingRelaxed: 24,
};

/**
 * Named text styles — screens reference these instead of repeating values.
 */
export const textStyles = {
  display: {
    fontSize: typography.sizeDisplay,
    fontWeight: typography.bold,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  heading: {
    fontSize: typography.sizeHeading,
    fontWeight: typography.bold,
    letterSpacing: -0.3,
    color: colors.textPrimary,
  },
  title: {
    fontSize: typography.sizeTitle,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  bodyLarge: {
    fontSize: typography.sizeBodyLarge,
    fontWeight: typography.regular,
    color: colors.textPrimary,
  },
  body: {
    fontSize: typography.sizeBody,
    fontWeight: typography.regular,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontSize: typography.sizeBodySmall,
    fontWeight: typography.regular,
    color: colors.textSecondary,
  },
  label: {
    fontSize: typography.sizeCaption,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  caption: {
    fontSize: typography.sizeCaption,
    fontWeight: typography.regular,
    color: colors.textMuted,
  },
  overline: {
    fontSize: typography.sizeOverline,
    fontWeight: typography.semibold,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  stat: {
    fontSize: typography.sizeStat,
    fontWeight: typography.bold,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  mono: {
    fontSize: typography.sizeBody,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
};

/**
 * Subtle elevation — a hairline border plus a very light shadow.
 * Avoids heavy shadows and glassmorphism.
 */
export const elevation = {
  low: {
    shadowColor: '#0A1B2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
};

export const borders = {
  hairline: 1,
  color: colors.border,
  radius: radius.md,
};

const theme = { colors, spacing, radius, typography, textStyles, elevation, borders };

export default theme;
