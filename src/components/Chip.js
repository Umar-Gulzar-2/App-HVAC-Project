/**
 * Chip — selectable filter chip (used on Records and Projects screens).
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

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
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    minHeight: 34,
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.navy800, borderColor: colors.navy800 },
  label: { fontSize: typography.sizeCaption, fontWeight: typography.medium, color: colors.textSecondary },
  selectedLabel: { color: colors.textInverse, fontWeight: typography.semibold },
});
