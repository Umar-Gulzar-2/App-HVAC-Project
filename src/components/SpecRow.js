/**
 * SpecRow — one equipment-spec line: quiet label, value on the right
 * (mono for identifiers, dates, quantities — sans for names).
 * Used inside the unit spec sheet.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '../theme/theme';

export default function SpecRow({ label, value, mono = false, last = false }) {
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, mono && styles.valueMono]} numberOfLines={2}>
        {value ?? '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  label: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, flexShrink: 0 },
  value: { fontFamily: fonts.medium, fontSize: typography.sizeBody, color: colors.textPrimary, textAlign: 'right', flex: 1 },
  valueMono: { fontFamily: fonts.monoMedium, fontVariant: ['tabular-nums'], letterSpacing: 0.2 },
});
