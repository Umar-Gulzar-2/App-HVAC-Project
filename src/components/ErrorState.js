/**
 * ErrorState — plain-language failure notice with Retry.
 * Never shows incomplete data as if it were current.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '../theme/theme';
import Button from './Button';

export default function ErrorState({ title = 'Couldn’t load this screen', message = 'Something went wrong while loading data.', onRetry, testID }) {
  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.rule} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} variant="secondary" size="sm" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  rule: { width: 24, height: 2, backgroundColor: colors.danger, marginBottom: spacing.md, opacity: 0.7 },
  title: { fontFamily: fonts.medium, fontSize: typography.sizeBodyLarge, color: colors.textPrimary },
  message: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeBodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 19,
  },
  action: { marginTop: spacing.lg, alignSelf: 'flex-start' },
});
