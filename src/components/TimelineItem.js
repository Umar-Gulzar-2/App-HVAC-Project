/**
 * TimelineItem — one service record rendered as a logbook entry:
 * mono date column on the left, content on the right, hairline below.
 * Newest first. Earlier records are never rewritten.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, typography } from '../theme/theme';
import StatusBadge from './StatusBadge';

const TYPE_TONES = {
  Installation: 'info',
  Repair: 'warning',
  Maintenance: 'neutral',
  'Refrigerant Service': 'danger',
  Replacement: 'navy',
};

export default function TimelineItem({ record, technicianName, isLast = false }) {
  return (
    <View style={[styles.row, !isLast && styles.divider]}>
      <View style={styles.dateCol}>
        <Text style={styles.date}>{record.date}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.headline}>
          <Text style={styles.work} numberOfLines={3}>
            {record.workPerformed}
          </Text>
        </View>
        <View style={styles.badgeRow}>
          <StatusBadge label={record.serviceType} tone={TYPE_TONES[record.serviceType] || 'neutral'} />
          {record.refrigerantQuantity != null ? (
            <Text style={styles.stat}>{record.refrigerantQuantity} lbs added</Text>
          ) : null}
        </View>
        {technicianName ? <Text style={styles.meta}>{technicianName}</Text> : null}
        {record.leakRepairInfo ? <Text style={styles.detail}>Leak / repair: {record.leakRepairInfo}</Text> : null}
        {record.testNotes ? <Text style={styles.detail}>Tests: {record.testNotes}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingVertical: spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  dateCol: { width: 84, paddingTop: 1 },
  date: { fontFamily: fonts.monoMedium, fontSize: typography.sizeCaption, color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  content: { flex: 1, paddingLeft: spacing.md },
  headline: { flexDirection: 'row' },
  work: { flex: 1, fontFamily: fonts.regular, fontSize: typography.sizeBody, color: colors.textPrimary, lineHeight: 19 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  stat: { fontFamily: fonts.monoMedium, fontSize: typography.sizeCaption, color: colors.textSecondary, fontVariant: ['tabular-nums'] },
  meta: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textSecondary, marginTop: spacing.xs },
  detail: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
});
