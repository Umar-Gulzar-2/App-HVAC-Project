/**
 * Card — a single ruled surface (hairline border, no shadow).
 * Used sparingly: spec sheets, case files, modal sheets.
 * Lists do NOT live in cards — they use flush ledger rows.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/theme';

export default function Card({ children, onPress, style, padded = true, testID }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        style={({ pressed }) => [styles.card, padded && styles.padded, style, pressed && styles.pressed]}
        testID={testID}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.card, padded && styles.padded, style]} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  padded: { padding: spacing.lg },
  pressed: { backgroundColor: colors.canvas },
});
