/**
 * ListRow — one ledger row: flush white surface, hairline divider above,
 * left-aligned content. Optional leading (mono index/ID), badge, trailing.
 * Rows of a list sit edge-to-edge inside one panel — rules, not boxes.
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '../theme/theme';

export default function ListRow({ title, meta, meta2, leading, badge, trailing, onPress, first = false, accent = false, monoTitle = false, metaMono = false, testID }) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed } = {}) => [styles.row, !first && styles.divider, pressed && onPress ? styles.pressed : null]}
      testID={testID}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.body}>
        <Text style={[monoTitle ? styles.titleMono : styles.title, accent && styles.titleAccent]} numberOfLines={1}>
          {title}
        </Text>
        {meta ? (
          <Text style={[styles.meta, metaMono && styles.mono]} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
        {meta2 ? (
          <Text style={metaMono ? styles.monoMuted : styles.meta2} numberOfLines={1}>
            {meta2}
          </Text>
        ) : null}
      </View>
      {badge}
      {trailing}
      {onPress && !trailing ? <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.chevron} /> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md + 1,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.hairline },
  pressed: { backgroundColor: colors.canvas },
  leading: { marginRight: spacing.md },
  body: { flex: 1, paddingRight: spacing.sm },
  title: { fontFamily: fonts.medium, fontSize: typography.sizeBody, color: colors.textPrimary, letterSpacing: -0.1 },
  titleMono: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeBody,
    color: colors.textPrimary,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  titleAccent: { color: colors.textAccent },
  meta: { fontFamily: fonts.regular, fontSize: typography.sizeBodySmall, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  mono: { fontFamily: fonts.monoMedium, fontSize: typography.sizeCaption, color: colors.textPrimary, marginTop: 2, letterSpacing: 0.2, fontVariant: ['tabular-nums'] },
  monoMuted: { fontFamily: fonts.mono, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: 2, letterSpacing: 0.2, fontVariant: ['tabular-nums'] },
  meta2: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: 2, lineHeight: 16 },
  chevron: { marginLeft: spacing.xs },
});
