/**
 * StatTile — dashboard summary count (proposal: admin dashboard shows
 * project, technician, AC unit, open attention and service-record counts).
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borders, colors, elevation, radius, spacing, typography } from '../theme/theme';

export default function StatTile({ label, value, tone = 'default', onPress, style }) {
  const valueColor = tone === 'warning' ? colors.warning : tone === 'danger' ? colors.danger : colors.textPrimary;
  const accent = tone === 'warning' ? colors.warningBg : tone === 'danger' ? colors.dangerBg : colors.blue050;

  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${label}: ${value}`}
      style={({ pressed } = {}) => [styles.tile, pressed && onPress ? styles.pressed : null, style]}
      testID={`stat-${label}`}
    >
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: valueColor }]}>{String(value)}</Text>
      <Text style={styles.label}>{label}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    padding: spacing.lg,
    width: '48%',
    marginBottom: spacing.md,
    ...elevation.low,
  },
  pressed: { backgroundColor: colors.surfaceAlt },
  accent: { width: 22, height: 4, borderRadius: radius.pill, marginBottom: spacing.md },
  value: { fontSize: typography.sizeStat, fontWeight: typography.bold, letterSpacing: -0.5 },
  label: { fontSize: typography.sizeCaption, color: colors.textSecondary, marginTop: spacing.xs },
});
