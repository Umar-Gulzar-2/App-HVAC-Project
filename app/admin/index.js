/**
 * Admin Dashboard — the administrator's home.
 * Shows proposal-required counts (projects, technicians, AC units, open
 * attention, service records) and links to the management screens.
 * Counts come from temporary sample data until Firestore connects (Chunk 2+).
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Card from '../../src/components/Card';
import ListRow from '../../src/components/ListRow';
import ScreenContainer from '../../src/components/ScreenContainer';
import SectionHeader from '../../src/components/SectionHeader';
import SignOutButton from '../../src/components/SignOutButton';
import StatTile from '../../src/components/StatTile';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { attentionCases, projects, serviceRecords, technicians, units } from '../../src/data/sampleData';
import { colors, spacing, typography } from '../../src/theme/theme';

export default function AdminDashboard() {
  const router = useRouter();
  const { role, userName, companyName } = useDemoSession();

  const counts = useMemo(
    () => ({
      projects: projects.filter((p) => p.status === 'active').length,
      technicians: technicians.filter((t) => t.role === 'technician').length,
      units: units.length,
      records: serviceRecords.length,
      openAttention: attentionCases.filter((c) => c.status !== 'resolved').length,
    }),
    []
  );

  // Demo-level role guard. Real route protection with Firebase arrives in Chunk 2.
  // (Kept after all hooks so the hook order never changes between renders.)
  if (role !== 'admin') {
    return <Redirect href={role === 'technician' ? '/technician' : '/login'} />;
  }

  const notBuiltYet = (feature) => Alert.alert(feature, 'This screen connects to Firestore in a later milestone.');

  return (
    <View style={styles.page}>
      <AppHeader
        variant="home"
        title={companyName ?? 'Dashboard'}
        subtitle={`Signed in as ${userName ?? 'Administrator'} · Administrator`}
        badgeLabel="ADMINISTRATOR"
        right={<SignOutButton />}
      />
      <ScreenContainer>
        {/* Summary counts */}
        <View style={styles.statsGrid}>
          <StatTile label="Active projects" value={counts.projects} onPress={() => router.push('/projects')} />
          <StatTile label="Technicians" value={counts.technicians} onPress={() => notBuiltYet('Technician management')} />
          <StatTile label="AC units" value={counts.units} onPress={() => router.push('/projects')} />
          <StatTile label="Service records" value={counts.records} onPress={() => router.push('/admin/records')} />
          <StatTile
            label="Open attention"
            value={counts.openAttention}
            tone="warning"
            onPress={() => router.push('/compliance')}
            style={styles.statWide}
          />
        </View>

        {/* Management shortcuts */}
        <SectionHeader title="Management" />
        <Card padded={false}>
          <ListRow
            first
            title="Projects"
            meta="Commercial projects owned by your company"
            onPress={() => router.push('/projects')}
            testID="row-projects"
          />
          <ListRow title="AC Models" meta="Reusable manufacturer & model entries" onPress={() => router.push('/admin/models')} />
          <ListRow title="Service Records" meta="Company-wide work history and filters" onPress={() => router.push('/admin/records')} />
          <ListRow
            title="Compliance Attention"
            meta="Open cases awaiting administrative review"
            badge={<StatusBadge label={`${counts.openAttention} open`} tone={counts.openAttention > 0 ? 'warning' : 'success'} />}
            onPress={() => router.push('/compliance')}
          />
          <ListRow
            title="Technicians"
            meta="Add, edit and deactivate technician accounts"
            onPress={() => notBuiltYet('Technician management')}
          />
        </Card>

        <Text style={styles.footnote}>Preview build — data shown is sample data until the Firebase connection is added.</Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: spacing.lg },
  statWide: { width: '100%' },
  footnote: {
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
