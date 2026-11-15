/**
 * EmptyState — left-aligned explanation of an empty list.
 * Mono micro-label for context, plain language, optional add action.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '../theme/theme';
import Button from './Button';

export default function EmptyState({ label, title, message, actionLabel, onAction, testID }) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.rule} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  rule: { width: 24, height: 2, backgroundColor: colors.hairlineStrong, marginBottom: spacing.md },
  label: { ...textMeta(), marginBottom: spacing.xs },
  title: { fontFamily: fonts.medium, fontSize: typography.sizeBodyLarge, color: colors.textPrimary, letterSpacing: -0.1 },
  message: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 19,
  },
  action: { marginTop: spacing.lg, alignSelf: 'flex-start' },
});

function textMeta() {
  return {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  };
}
