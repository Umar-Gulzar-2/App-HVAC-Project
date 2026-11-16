/**
 * Chip — filter chip: white outline by default, accent-soft when selected.
 * Sentence case, radius 6, tight to the 4px grid.
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, spacing, typography } from '../theme/theme';

export default function Chip({ label, selected = false, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.selected, style]}
      testID={`chip-${label}`}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    minHeight: 34,
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.blue050, borderColor: colors.blue600 },
  label: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textSecondary },
  selectedLabel: { color: colors.textAccent },
});
