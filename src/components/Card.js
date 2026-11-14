/**
 * Card — a restrained white surface with hairline border.
 * Used sparingly: stat tiles, identity blocks, list groupings — not wrapped
 * around every element on a screen.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { borders, colors, elevation, radius, spacing } from '../theme/theme';

export default function Card({ children, onPress, style, padded = true, testID }) {
  const content = <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;

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
  return <View testID={testID}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: borders.hairline,
    borderColor: colors.border,
    ...elevation.low,
  },
  padded: { padding: spacing.lg },
  pressed: { backgroundColor: colors.surfaceAlt },
});
