/**
 * SectionHeader — quiet sentence-case section label with optional action
 * or mono count. No shouty all-caps eyebrows.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '../theme/theme';

export default function SectionHeader({ title, count, actionLabel, onAction, style }) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        {count != null ? <Text style={styles.count}>{count}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  titleWrap: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  title: { fontFamily: fonts.medium, fontSize: typography.sizeBody, color: colors.textPrimary, letterSpacing: -0.1 },
  count: { fontFamily: fonts.monoMedium, fontSize: typography.sizeCaption, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  action: { fontFamily: fonts.medium, fontSize: typography.sizeBodySmall, color: colors.textAccent },
});
