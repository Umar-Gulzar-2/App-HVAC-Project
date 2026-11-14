/**
 * TimelineItem — one service event on the unit history timeline.
 * Records are displayed newest first; earlier records are never overwritten.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
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
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: colors.blue600 }]} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={[styles.content, !isLast && styles.contentSpaced]}>
        <View style={styles.headline}>
          <Text style={styles.date}>{record.date}</Text>
          <StatusBadge label={record.serviceType} tone={TYPE_TONES[record.serviceType] || 'neutral'} />
        </View>
        <Text style={styles.work} numberOfLines={3}>
          {record.workPerformed}
        </Text>
        <Text style={styles.meta}>
          {technicianName ? `Technician: ${technicianName}` : null}
          {technicianName && record.refrigerantQuantity != null ? '  ·  ' : null}
          {record.refrigerantQuantity != null ? `Refrigerant: ${record.refrigerantQuantity} lbs` : null}
        </Text>
        {record.leakRepairInfo ? <Text style={styles.detail}>Leak / repair: {record.leakRepairInfo}</Text> : null}
        {record.testNotes ? <Text style={styles.detail}>Test notes: {record.testNotes}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rail: { width: 20, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginTop: 4 },
  content: { flex: 1, paddingLeft: spacing.sm },
  contentSpaced: { paddingBottom: spacing.lg },
  headline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  date: { fontSize: typography.sizeCaption, fontWeight: typography.bold, color: colors.textSecondary },
  work: { fontSize: typography.sizeBodySmall, color: colors.textPrimary, lineHeight: typography.leadingNormal },
  meta: { fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: spacing.xs },
  detail: { fontSize: typography.sizeCaption, color: colors.textSecondary, marginTop: spacing.xs, lineHeight: typography.leadingNormal },
});
