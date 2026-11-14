/**
 * Button — the single reusable action control.
 * Variants: primary (blue), secondary (outlined), ghost (text), danger.
 */
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  testID = 'button',
}) {
  const isDisabled = disabled || loading;

  const containerStyles = [styles.base, styles[variant], styles[size], isDisabled && styles.disabled, style];

  const textStyles = [styles.label, styles[`${variant}Label`], isDisabled && styles.disabledLabel];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      // Passing `disabled` through lets Pressable decline the touch itself
      // (correct on device, and respected by React Native Testing Library).
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [containerStyles, pressed && !isDisabled && styles.pressed]}
      testID={testID}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.blue600}
            style={styles.spinner}
          />
        )}
        <Text style={textStyles} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  spinner: { marginRight: spacing.sm },
  md: { paddingVertical: 12, paddingHorizontal: spacing.lg, minHeight: 44 },
  lg: { paddingVertical: 14, paddingHorizontal: spacing.xl, minHeight: 50 },
  sm: { paddingVertical: 8, paddingHorizontal: spacing.md, minHeight: 36 },
  primary: { backgroundColor: colors.blue600, borderColor: colors.blue600 },
  secondary: { backgroundColor: colors.surface, borderColor: colors.borderStrong },
  ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  label: { fontSize: typography.sizeBody, fontWeight: typography.semibold, textAlign: 'center' },
  primaryLabel: { color: colors.textInverse },
  secondaryLabel: { color: colors.textPrimary },
  ghostLabel: { color: colors.blue600 },
  dangerLabel: { color: colors.textInverse },
  disabledLabel: { color: colors.textMuted },
});
