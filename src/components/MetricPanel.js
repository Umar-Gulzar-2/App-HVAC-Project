/**
 * MetricPanel — the dashboard counts as ONE ruled ledger panel.
 * Replaces the "identical stat cards with accent dots" pattern: a single
 * surface, hairline-divided cells, a mono figure and a plain label.
 * No icons, no accent bars, no shadows.
 *
 * Layout: two columns per row; an odd final metric spans full width.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing, textStyles, typography } from '../theme/theme';

export default function MetricPanel({ metrics, style }) {
  const total = metrics.length;
  // Index where the final row begins (odd totals end with a full-width cell).
  const lastRowIndex = total % 2 === 1 ? Math.max(total - 1, 0) : Math.max(total - 2, 0);

  return (
    <View style={[styles.panel, style]} testID="metric-panel">
      {metrics.map((metric, index) => {
        const isFull = total % 2 === 1 && index === total - 1;
        const isLeft = !isFull && index % 2 === 0;
        const isBottomRow = index < lastRowIndex;

        const cellStyle = [
          styles.cell,
          isFull && styles.cellFull,
          isLeft && styles.cellRightBorder,
          isBottomRow && styles.cellBottomBorder,
        ];

        const Container = metric.onPress ? Pressable : View;
        return (
          <Container
            key={metric.label}
            onPress={metric.onPress}
            accessibilityRole={metric.onPress ? 'button' : undefined}
            accessibilityLabel={`${metric.label}: ${metric.value}`}
            style={({ pressed } = {}) => [cellStyle, pressed && metric.onPress ? styles.pressed : null]}
            testID={`stat-${metric.label}`}
          >
            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
              {String(metric.value)}
            </Text>
            <Text style={styles.label} numberOfLines={2}>
              {metric.label}
            </Text>
          </Container>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  cell: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexGrow: 1,
    minWidth: '50%',
  },
  cellFull: { minWidth: '100%', width: '100%' },
  cellRightBorder: { borderRightWidth: 1, borderRightColor: colors.hairline },
  cellBottomBorder: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  pressed: { backgroundColor: colors.canvas },
  value: { ...textStyles.metric },
  label: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeCaption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
});
