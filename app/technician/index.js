/**
 * Technician Dashboard — the technician's home.
 * Prioritises: recording new service work, active company projects,
 * recent activity as logbook entries, and attention cases relevant to
 * this technician. Sample data until Firestore connects (Chunks 5/6).
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Button from '../../src/components/Button';
import EmptyState from '../../src/components/EmptyState';
import ListRow from '../../src/components/ListRow';
import MetricPanel from '../../src/components/MetricPanel';
import ScreenContainer from '../../src/components/ScreenContainer';
import SectionHeader from '../../src/components/SectionHeader';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { attentionCases, projects, serviceRecords, techniciansById, unitsById } from '../../src/data/sampleData';
import { colors, fonts, radius, spacing, typography } from '../../src/theme/theme';

const TYPE_TONES = {
  Installation: 'info',
  Repair: 'warning',
  Maintenance: 'neutral',
  'Refrigerant Service': 'danger',
  Replacement: 'navy',
};

export default function TechnicianDashboard() {
  const router = useRouter();
  const { role, userName, companyName } = useDemoSession();

  const activeProjects = useMemo(() => projects.filter((p) => p.status === 'active'), []);
  const recentRecords = useMemo(
    () => [...serviceRecords].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4),
    []
  );
  const myCases = useMemo(
    () => attentionCases.filter((c) => c.status !== 'resolved' && c.assignedTechnicianIds?.length),
    []
  );
  const myRecentCount = useMemo(
    () => serviceRecords.filter((r) => techniciansById[r.technicianId]?.name === userName).length,
    [userName]
  );

  // Demo-level role guard — hooks above stay unconditional.
  if (role !== 'technician') {
    return <Redirect href={role === 'admin' ? '/admin' : '/login'} />;
  }

  return (
    <View style={styles.page}>
      <AppHeader
        variant="home"
        title={companyName ?? 'Dashboard'}
        subtitle={userName ? `Signed in as ${userName}` : undefined}
        meta={`${activeProjects.length} active projects · ${myCases.length} open attention`}
        roleLabel="Technician"
        userName={userName}
        right={<SignOutButton />}
      />
      <ScreenContainer>
        <Button
          label="New service record"
          size="lg"
          onPress={() => router.push('/service/new')}
          style={styles.primaryAction}
          testID="btn-new-service"
        />

        <MetricPanel
          style={styles.metrics}
          metrics={[
            { label: 'Active projects', value: activeProjects.length, onPress: () => router.push('/projects') },
            { label: 'Records logged', value: myRecentCount, onPress: () => router.push('/projects') },
            {
              label: 'Open attention',
              value: myCases.length,
              onPress: () => router.push('/compliance'),
            },
          ]}
        />

        <SectionHeader title="Active company projects" actionLabel="View all" onAction={() => router.push('/projects')} />
        <View style={styles.ledger}>
          {activeProjects.length === 0 ? (
            <EmptyState title="No active projects" message="Active projects assigned to your company will appear here." />
          ) : (
            activeProjects.map((project, index) => (
              <ListRow
                key={project.id}
                first={index === 0}
                title={project.name}
                meta={project.client}
                meta2={project.siteAddress}
                onPress={() => router.push(`/projects/${project.id}`)}
                testID={`row-project-${project.id}`}
              />
            ))
          )}
        </View>

        <SectionHeader title="Recent activity" />
        <View style={styles.ledger}>
          {recentRecords.map((record, index) => (
            <View key={record.id} style={[styles.logRow, index > 0 && styles.logDivider]}>
              <Text style={styles.logDate}>{record.date}</Text>
              <View style={styles.logBody}>
                <Text style={styles.logUnit}>
                  {record.unitId}
                  <Text style={styles.logSerial}>  {unitsById[record.unitId]?.serialNumber ?? ''}</Text>
                </Text>
                <View style={styles.logBadges}>
                  <StatusBadge label={record.serviceType} tone={TYPE_TONES[record.serviceType] || 'neutral'} />
                  <Text style={styles.logTech}>{techniciansById[record.technicianId]?.name ?? 'Unknown technician'}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <SectionHeader title="Attention relevant to you" />
        <View style={styles.ledger}>
          {myCases.length === 0 ? (
            <EmptyState
              title="No open attention items"
              message="When a record needs review, the case appears here for you to see."
            />
          ) : (
            myCases.map((item, index) => (
              <ListRow
                key={item.id}
                first={index === 0}
                title={item.title}
                meta={`${item.unitId} · ${projects.find((p) => p.id === item.projectId)?.name ?? ''}`}
                badge={<StatusBadge label="Open" tone={item.severity} />}
                onPress={() => router.push('/compliance')}
                testID={`row-case-${item.id}`}
              />
            ))
          )}
        </View>

        <Text style={styles.note}>Technicians view attention cases; only administrators resolve them.</Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  primaryAction: { marginTop: spacing.lg },
  metrics: { marginTop: spacing.lg },
  ledger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  logRow: { flexDirection: 'row', padding: spacing.md, paddingHorizontal: spacing.lg, minHeight: 52, alignItems: 'flex-start' },
  logDivider: { borderTopWidth: 1, borderTopColor: colors.hairline },
  logDate: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeCaption,
    color: colors.textSecondary,
    width: 84,
    paddingTop: 2,
    fontVariant: ['tabular-nums'],
  },
  logBody: { flex: 1, paddingLeft: spacing.md },
  logUnit: { fontFamily: fonts.monoMedium, fontSize: typography.sizeBody, color: colors.textPrimary, letterSpacing: 0.2 },
  logSerial: { fontFamily: fonts.mono, fontSize: typography.sizeCaption, color: colors.textMuted, letterSpacing: 0.2 },
  logBadges: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6, flexWrap: 'wrap' },
  logTech: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textSecondary },
  note: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 17,
    paddingHorizontal: spacing.lg,
  },
});
