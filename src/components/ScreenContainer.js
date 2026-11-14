/**
 * ScreenContainer — standard page scaffold: scrollable content with
 * consistent horizontal padding and bottom safe area.
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/theme';

export default function ScreenContainer({ children, scrollable = true, style, contentStyle }) {
  const insets = useSafeAreaInsets();

  if (!scrollable) {
    return <View style={[styles.page, { paddingBottom: insets.bottom }, style]}>{children}</View>;
  }

  return (
    <ScrollView
      style={[styles.page, style]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
});
