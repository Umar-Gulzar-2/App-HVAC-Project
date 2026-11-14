/**
 * ListRow — standard tappable list item: title, meta lines, trailing slot.
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';

export default function ListRow({ title, meta, meta2, badge, trailing, onPress, first = false, testID }) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed } = {}) => [styles.row, !first && styles.divider, pressed && onPress ? styles.pressed : null]}
      testID={testID}
    >
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
        {meta2 ? (
          <Text style={styles.meta2} numberOfLines={1}>
            {meta2}
          </Text>
        ) : null}
      </View>
      {badge}
      {trailing}
      {onPress && !trailing ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} /> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  pressed: { backgroundColor: colors.surfaceAlt },
  body: { flex: 1, paddingRight: spacing.sm },
  title: { fontSize: typography.sizeBody, fontWeight: typography.semibold, color: colors.textPrimary },
  meta: { fontSize: typography.sizeBodySmall, color: colors.textSecondary, marginTop: 3 },
  meta2: { fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: 2 },
  chevron: { marginLeft: spacing.xs },
});
