/**
 * LoadingState — short loading notice while data is fetched.
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '../theme/theme';

export default function LoadingState({ message = 'Loading…', testID }) {
  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size="small" color={colors.textMuted} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  message: { fontFamily: fonts.regular, fontSize: typography.sizeBodySmall, color: colors.textMuted },
});
