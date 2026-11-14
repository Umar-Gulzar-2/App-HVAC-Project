/**
 * EmptyState — shown when a list has no data (or no matches).
 * Always explains the situation and, where authorised, offers the add action.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import Button from './Button';

export default function EmptyState({ title, message, actionLabel, onAction, testID }) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.marker} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  marker: {
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.lg,
  },
  title: { fontSize: typography.sizeBodyLarge, fontWeight: typography.semibold, color: colors.textPrimary, textAlign: 'center' },
  message: {
    fontSize: typography.sizeBodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.leadingRelaxed,
  },
  action: { marginTop: spacing.lg },
});
