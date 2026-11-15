/**
 * Admin Dashboard — the administrator's home.
 * One ruled metric ledger for the proposal-required counts, an attention
 * strip when open cases exist, and a flush management list.
 * Counts come from temporary sample data until Firestore connects (Chunk 2+).
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import ListRow from '../../src/components/ListRow';
import MetricPanel from '../../src/components/MetricPanel';
import ScreenContainer from '../../src/components/ScreenContainer';
import SectionHeader from '../../src/components/SectionHeader';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { attentionCases, projects, serviceRecords, technicians, units } from '../../src/data/sampleData';
import { colors, fonts, radius, spacing, typography } from '../../src/theme/theme';

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
        subtitle={userName ? `Signed in as ${userName}` : undefined}
        meta="Preview · sample data"
        roleLabel="Administrator"
        userName={userName}
        right={<SignOutButton />}
      />
      <ScreenContainer>
        {/* The one number that matters — semantic, quiet, tappable */}
        {counts.openAttention > 0 ? (
          <Pressable
            onPress={() => router.push('/compliance')}
            accessibilityRole="button"
            style={({ pressed }) => [styles.attentionStrip, pressed && styles.attentionPressed]}
            testID="attention-strip"
          >
            <View style={styles.attentionBody}>
              <Text style={styles.attentionText}>
                <Text style={styles.attentionFigure}>{counts.openAttention}</Text> open attention cases await review
              </Text>
              <Text style={styles.attentionAction}>Open compliance</Text>
            </View>
          </Pressable>
        ) : null}

        <MetricPanel
          style={styles.metrics}
          metrics={[
            { label: 'Active projects', value: counts.projects, onPress: () => router.push('/projects') },
            { label: 'Technicians', value: counts.technicians, onPress: () => notBuiltYet('Technician management') },
            { label: 'AC units', value: counts.units, onPress: () => router.push('/projects') },
            { label: 'Service records', value: counts.records, onPress: () => router.push('/admin/records') },
            { label: 'Open attention', value: counts.openAttention, onPress: () => router.push('/compliance') },
          ]}
        />

        <SectionHeader title="Management" />
        <View style={styles.ledger}>
          <ListRow
            first
            title="Projects"
            meta="Commercial projects owned by your company"
            onPress={() => router.push('/projects')}
            testID="row-projects"
          />
          <ListRow title="AC Models" meta="Reusable manufacturer and model entries" onPress={() => router.push('/admin/models')} />
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
        </View>

        <Text style={styles.footnote}>Sample data — connects to Firestore in Milestone 2</Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  attentionStrip: {
    marginTop: spacing.lg,
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: '#EBD9AE',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  attentionPressed: { opacity: 0.85 },
  attentionBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  attentionText: { flex: 1, fontFamily: fonts.regular, fontSize: typography.sizeBodySmall, color: '#6B4700', lineHeight: 18 },
  attentionFigure: { fontFamily: fonts.monoSemibold, fontSize: typography.sizeBody, color: colors.warning, fontVariant: ['tabular-nums'] },
  attentionAction: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.warning },
  metrics: { marginTop: spacing.lg },
  ledger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  footnote: {
    fontFamily: fonts.mono,
    fontSize: typography.sizeMeta,
    letterSpacing: 0.6,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    textTransform: 'uppercase',
  },
});
