/**
 * Technician Dashboard — the technician's home.
 * Prioritises: active company projects, recording new service work,
 * recent activity, and attention cases relevant to this technician.
 * Sample data until Firestore connects (Chunk 5/6).
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import EmptyState from '../../src/components/EmptyState';
import ListRow from '../../src/components/ListRow';
import ScreenContainer from '../../src/components/ScreenContainer';
import SectionHeader from '../../src/components/SectionHeader';
import SignOutButton from '../../src/components/SignOutButton';
import StatTile from '../../src/components/StatTile';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { attentionCases, projects, serviceRecords, techniciansById, unitsById } from '../../src/data/sampleData';
import { colors, spacing, typography } from '../../src/theme/theme';

export default function TechnicianDashboard() {
  const router = useRouter();
  const { role, userName, companyName } = useDemoSession();

  const activeProjects = useMemo(() => projects.filter((p) => p.status === 'active'), []);
  const recentRecords = useMemo(
    () => [...serviceRecords].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
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
        subtitle={`Signed in as ${userName ?? 'Technician'} · Technician`}
        badgeLabel="TECHNICIAN"
        right={<SignOutButton />}
      />
      <ScreenContainer>
        <View style={styles.statsGrid}>
          <StatTile label="Active projects" value={activeProjects.length} onPress={() => router.push('/projects')} />
          <StatTile label="Your records logged" value={myRecentCount} onPress={() => router.push('/projects')} />
          <StatTile
            label="Open attention for you"
            value={myCases.length}
            tone={myCases.length > 0 ? 'warning' : 'default'}
            onPress={() => router.push('/compliance')}
            style={styles.statWide}
          />
        </View>

        <Button
          label="New Service Record"
          size="lg"
          onPress={() => router.push('/service/new')}
          style={styles.primaryAction}
          testID="btn-new-service"
        />

        <SectionHeader title="Active company projects" actionLabel="View all" onAction={() => router.push('/projects')} />
        <Card padded={false}>
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
        </Card>

        <SectionHeader title="Recent activity" />
        <Card padded={false}>
          {recentRecords.map((record, index) => (
            <ListRow
              key={record.id}
              first={index === 0}
              title={`${record.serviceType} · ${record.date}`}
              meta={`${record.unitId} — ${unitsById[record.unitId]?.serialNumber ?? ''}`}
              meta2={`By ${techniciansById[record.technicianId]?.name ?? 'Unknown technician'}`}
              badge={<StatusBadge label={unitsById[record.unitId] ? projects.find((p) => p.id === record.projectId)?.name ?? '' : ''} tone="neutral" style={styles.projectBadge} />}
              onPress={() => router.push(`/units/${record.unitId}`)}
              testID={`row-recent-${record.id}`}
            />
          ))}
        </Card>

        <SectionHeader title="Attention relevant to you" />
        <Card padded={false}>
          {myCases.length === 0 ? (
            <EmptyState title="No open attention items" message="When a record needs review, the case will appear here for you to see." />
          ) : (
            myCases.map((item, index) => (
              <ListRow
                key={item.id}
                first={index === 0}
                title={item.title}
                meta={`${item.unitId} · ${projects.find((p) => p.id === item.projectId)?.name ?? ''}`}
                meta2={item.reason}
                badge={<StatusBadge label="Open" tone={item.severity} />}
                onPress={() => router.push('/compliance')}
                testID={`row-case-${item.id}`}
              />
            ))
          )}
        </Card>

        <Text style={styles.readonlyNote}>Technicians can view attention cases. Only administrators resolve or close them.</Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: spacing.lg },
  statWide: { width: '100%' },
  primaryAction: { marginTop: spacing.xs },
  projectBadge: { maxWidth: 130 },
  readonlyNote: {
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: typography.leadingNormal,
    paddingHorizontal: spacing.lg,
  },
});
