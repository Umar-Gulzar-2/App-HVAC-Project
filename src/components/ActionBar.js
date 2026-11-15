/**
 * ActionBar — sticky bottom action footer (the app-like form pattern):
 * hairline top edge, safe-area padding, one primary action.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/theme';
import Button from './Button';

export default function ActionBar({ label, onPress, loading = false, secondaryLabel, onSecondaryPress, testID }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
      {secondaryLabel ? (
        <Button label={secondaryLabel} variant="secondary" size="lg" onPress={onSecondaryPress} style={styles.secondary} />
      ) : null}
      <Button label={label} size="lg" onPress={onPress} loading={loading} style={styles.primary} testID={testID} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  primary: { flex: 1 },
  secondary: { flex: 1 },
});
