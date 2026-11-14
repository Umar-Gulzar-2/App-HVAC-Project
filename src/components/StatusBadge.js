/**
 * StatusBadge — small labelled chip for statuses and service types.
 * Tone controls color: success | warning | danger | info | neutral.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

const TONES = {
  success: { fg: colors.success, bg: colors.successBg },
  warning: { fg: colors.warning, bg: colors.warningBg },
  danger: { fg: colors.danger, bg: colors.dangerBg },
  info: { fg: colors.info, bg: colors.infoBg },
  neutral: { fg: colors.neutral, bg: colors.neutralBg },
  navy: { fg: colors.navy800, bg: colors.surfaceSunken },
};

export default function StatusBadge({ label, tone = 'neutral', style }) {
  const palette = TONES[tone] || TONES.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.text, { color: palette.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: { fontSize: typography.sizeOverline, fontWeight: typography.bold, letterSpacing: 0.4 },
});
