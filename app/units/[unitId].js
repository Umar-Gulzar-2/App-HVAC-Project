/**
 * Unit Details — the equipment record: mono unit ID, spec sheet, and the
 * complete service logbook (newest first). Records are preserved; new work
 * never overwrites earlier entries.
 */
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ActionBar from '../../src/components/ActionBar';
import AppHeader from '../../src/components/AppHeader';
import Card from '../../src/components/Card';
import EmptyState from '../../src/components/EmptyState';
import ScreenContainer from '../../src/components/ScreenContainer';
import SectionHeader from '../../src/components/SectionHeader';
import SignOutButton from '../../src/components/SignOutButton';
import SpecRow from '../../src/components/SpecRow';
import StatusBadge from '../../src/components/StatusBadge';
import TimelineItem from '../../src/components/TimelineItem';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModelsById, projectsById, serviceRecords, techniciansById, unitsById } from '../../src/data/sampleData';
import { colors, fonts, spacing, typography } from '../../src/theme/theme';

export default function UnitDetailsScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams();
  const { role } = useDemoSession();

  const unit = useMemo(() => unitsById[unitId], [unitId]);
  const timeline = useMemo(
    () => serviceRecords.filter((r) => r.unitId === unitId).sort((a, b) => b.date.localeCompare(a.date)),
    [unitId]
  );

  if (!role) return <Redirect href="/login" />;

  if (!unit) {
    return (
      <View style={styles.page}>
        <AppHeader variant="page" title="Unit record" right={<SignOutButton />} />
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
        titleMono
        title={unit.id}
        subtitle={`${model?.manufacturer ?? ''} ${model?.modelNumber ?? ''} · ${project?.name ?? ''}`}
        meta={`Serial ${unit.serialNumber}`}
        right={<SignOutButton />}
      />
      <ScreenContainer contentStyle={isTechnician ? styles.contentWithBar : undefined}>
        {/* Spec sheet */}
        <Card style={styles.specCard} padded={false} testID="spec-sheet">
          <View style={styles.specHead}>
            <Text style={styles.specHeadLabel}>Equipment record</Text>
            <StatusBadge label="Active" tone="success" />
          </View>
          <View style={styles.specBody}>
            <SpecRow label="Permanent unit ID" value={unit.id} mono />
            <SpecRow label="Serial number" value={unit.serialNumber} mono />
            <SpecRow label="Installation date" value={unit.installationDate} mono />
            <SpecRow label="Manufacturer" value={model?.manufacturer} />
            <SpecRow label="Model number" value={model?.modelNumber} mono />
            <SpecRow label="Equipment type" value={model?.equipmentType} />
            <SpecRow label="Refrigerant type" value={unit.refrigerantType} mono />
            <SpecRow label="Full refrigerant charge" value={`${unit.fullChargeLbs} lbs`} mono />
            <SpecRow label="Project" value={project?.name} last />
          </View>
        </Card>

        {/* Service logbook */}
        <SectionHeader title="Service history" count={`${timeline.length} entries`} />
        <Card padded={false}>
          <View style={styles.logPad}>
            {timeline.length === 0 ? (
              <EmptyState
                title="No service records yet"
                message="Installation, repair, maintenance and refrigerant service records for this unit will appear here."
                actionLabel={isTechnician ? 'Add service record' : undefined}
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
          </View>
        </Card>

        {!isTechnician ? (
          <Text style={styles.adminNote}>Service work is recorded by technicians from their dashboard or this screen.</Text>
        ) : (
          <View style={styles.trailingSpace} />
        )}
      </ScreenContainer>

      {isTechnician ? (
        <ActionBar
          label="Add service record"
          onPress={() => router.push(`/service/new?unitId=${unit.id}`)}
          testID="btn-add-service"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  contentWithBar: { paddingBottom: spacing.xl },
  missingCard: { marginTop: spacing.xl },
  specCard: { marginTop: spacing.lg },
  specHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  specHeadLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  specBody: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  logPad: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  adminNote: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 17,
    paddingHorizontal: spacing.lg,
  },
  trailingSpace: { height: spacing.lg },
});
