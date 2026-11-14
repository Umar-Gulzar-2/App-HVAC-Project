/**
 * Unit Details screen — permanent unit identity + complete service timeline.
 * The timeline shows every record ever saved for this unit, newest first.
 * Service records are preserved; new work never overwrites earlier records.
 */
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import EmptyState from '../../src/components/EmptyState';
import ScreenContainer from '../../src/components/ScreenContainer';
import SectionHeader from '../../src/components/SectionHeader';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import TimelineItem from '../../src/components/TimelineItem';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModelsById, projectsById, serviceRecords, techniciansById, unitsById } from '../../src/data/sampleData';
import { colors, spacing, textStyles, typography } from '../../src/theme/theme';

function DetailField({ label, value, wide = false }) {
  return (
    <View style={[styles.field, wide && styles.fieldWide]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value ?? '—'}</Text>
    </View>
  );
}

export default function UnitDetailsScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams();
  const { role } = useDemoSession();

  const unit = useMemo(() => unitsById[unitId], [unitId]);
  const timeline = useMemo(
    () =>
      serviceRecords
        .filter((r) => r.unitId === unitId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [unitId]
  );

  if (!role) return <Redirect href="/login" />;

  if (!unit) {
    return (
      <View style={styles.page}>
        <AppHeader variant="page" title="Unit details" subtitle="Unit not found" right={<SignOutButton />} />
        <ScreenContainer>
          <Card style={styles.missingCard}>
            <EmptyState
              title="Unit not found"
              message="This unit ID does not exist in your company records."
              actionLabel="Back to projects"
              onAction={() => router.replace('/projects')}
            />
          </Card>
        </ScreenContainer>
      </View>
    );
  }

  const model = acModelsById[unit.modelId];
  const project = projectsById[unit.projectId];
  const isTechnician = role === 'technician';

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title={unit.id}
        subtitle={`${model?.manufacturer ?? ''} ${model?.modelNumber ?? ''} · ${project?.name ?? ''}`}
        badgeLabel="SHARED COMPANY EQUIPMENT"
        right={<SignOutButton />}
      />
      <ScreenContainer>
        {/* Identity block */}
        <Card style={styles.identityCard}>
          <View style={styles.identityHead}>
            <View style={styles.identityIdWrap}>
              <Text style={styles.overline}>Permanent unit ID</Text>
              <Text style={styles.unitId} testID="unit-id">{unit.id}</Text>
            </View>
            <StatusBadge label="Active" tone="success" />
          </View>
          <View style={styles.fieldGrid}>
            <DetailField label="Serial number" value={unit.serialNumber} />
            <DetailField label="Installation date" value={unit.installationDate} />
            <DetailField label="Manufacturer" value={model?.manufacturer} />
            <DetailField label="Model number" value={model?.modelNumber} />
            <DetailField label="Equipment type" value={model?.equipmentType} />
            <DetailField label="Refrigerant type" value={unit.refrigerantType} />
            <DetailField label="Full refrigerant charge" value={`${unit.fullChargeLbs} lbs`} />
            <DetailField label="Project" value={project?.name} />
          </View>
        </Card>

        {/* Service history */}
        <SectionHeader title={`Service history (${timeline.length})`} />
        <Card>
          {timeline.length === 0 ? (
            <EmptyState
              title="No service records yet"
              message="Installation, repair, maintenance and refrigerant service records for this unit will appear here."
              actionLabel={isTechnician ? 'Add Service Record' : undefined}
              onAction={isTechnician ? () => router.push(`/service/new?unitId=${unit.id}`) : undefined}
              testID="empty-history"
            />
          ) : (
            timeline.map((record, index) => (
              <TimelineItem
                key={record.id}
                record={record}
                technicianName={techniciansById[record.technicianId]?.name}
                isLast={index === timeline.length - 1}
              />
            ))
          )}
        </Card>

        {isTechnician ? (
          <Button
            label="Add Service Record"
            size="lg"
            onPress={() => router.push(`/service/new?unitId=${unit.id}`)}
            style={styles.addButton}
            testID="btn-add-service"
          />
        ) : (
          <Text style={styles.adminNote}>Service work is recorded by technicians from their dashboard or this screen.</Text>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  missingCard: { marginTop: spacing.xl },
  identityCard: { marginTop: spacing.lg },
  identityHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  identityIdWrap: { flex: 1, paddingRight: spacing.md },
  overline: { ...textStyles.overline, marginBottom: spacing.xs },
  unitId: { ...textStyles.title, fontSize: 22, letterSpacing: 0.5 },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  field: { width: '50%', paddingVertical: spacing.sm, paddingRight: spacing.md },
  fieldWide: { width: '100%' },
  fieldLabel: { fontSize: typography.sizeOverline, fontWeight: typography.semibold, color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },
  fieldValue: { fontSize: typography.sizeBody, fontWeight: typography.medium, color: colors.textPrimary, marginTop: 3 },
  addButton: { marginTop: spacing.xl },
  adminNote: {
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: typography.leadingNormal,
    paddingHorizontal: spacing.lg,
  },
});
