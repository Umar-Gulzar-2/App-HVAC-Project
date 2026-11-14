/**
 * LoadingState — short loading message/indicator while data is fetched.
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

export default function LoadingState({ message = 'Loading…', testID }) {
  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size="small" color={colors.blue600} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  message: { fontSize: typography.sizeBodySmall, color: colors.textSecondary },
});
