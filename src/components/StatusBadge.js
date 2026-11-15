/**
 * StatusBadge — semantic status tag: light tint, colored text, status dot.
 * Color communicates status only (Stripe rule): never decoration.
 * Sentence case, small, quiet.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '../theme/theme';

const TONES = {
  success: { fg: colors.success, bg: colors.successBg },
  warning: { fg: colors.warning, bg: colors.warningBg },
  danger: { fg: colors.danger, bg: colors.dangerBg },
  info: { fg: colors.info, bg: colors.infoBg },
  neutral: { fg: colors.textSecondary, bg: colors.canvasSunken },
  navy: { fg: colors.navy800, bg: colors.canvasSunken },
};

export default function StatusBadge({ label, tone = 'neutral', dot = true, style }) {
  const palette = TONES[tone] || TONES.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      {dot ? <View style={[styles.dot, { backgroundColor: palette.fg }]} /> : null}
      <Text style={[styles.text, { color: palette.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  text: { fontFamily: fonts.medium, fontSize: typography.sizeMeta, letterSpacing: 0.1 },
});
