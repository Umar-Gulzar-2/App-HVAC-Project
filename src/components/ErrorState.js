/**
 * ErrorState — shown when a load or request fails. Always offers Retry.
 * The app never silently shows incomplete data as if it were current.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong while loading data.', onRetry, testID }) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>Couldn’t load this screen</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} variant="secondary" size="sm" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  title: { fontSize: typography.sizeBodyLarge, fontWeight: typography.semibold, color: colors.textPrimary },
  message: {
    fontSize: typography.sizeBodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.leadingRelaxed,
  },
  action: { marginTop: spacing.lg },
});
