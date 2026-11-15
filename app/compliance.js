/**
 * Compliance Attention screen — case files for administrative review.
 *
 * Scope (proposal §3.1 / §7): the app flags a limited, documented set of
 * conditions; uncertain records are labelled "Needs Admin Review".
 * Admin and the relevant technician can view cases; ONLY the administrator
 * can resolve or close a case, with a recorded reason. Automatic EPA
 * calculation is not claimed — Chunk 8 implements the supported scenario
 * or falls back to this manual review workflow.
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../src/components/AppHeader';
import Button from '../src/components/Button';
import Card from '../src/components/Card';
import EmptyState from '../src/components/EmptyState';
import ScreenContainer from '../src/components/ScreenContainer';
import SignOutButton from '../src/components/SignOutButton';
import StatusBadge from '../src/components/StatusBadge';
import TextField from '../src/components/TextField';
import { useDemoSession } from '../src/context/DemoSessionContext';
import { attentionCases, projectsById, technicians, unitsById } from '../src/data/sampleData';
import { colors, fonts, radius, spacing, typography } from '../src/theme/theme';

const SEVERITY_COLORS = { danger: colors.danger, warning: colors.warning, info: colors.info };

export default function ComplianceScreen() {
  const router = useRouter();
  const { role, userName } = useDemoSession();
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'resolved'
  const [resolveTarget, setResolveTarget] = useState(null);
  const [resolutionReason, setResolutionReason] = useState('');
  const [resolveError, setResolveError] = useState('');

  const cases = useMemo(() => {
    // Technicians see ONLY the cases relevant to them, and only while open
    // (proposal: "Admin and the relevant technician can view open cases").
    if (role === 'technician') {
      const me = technicians.find((t) => t.role === 'technician' && t.name === userName);
      return attentionCases.filter((c) => c.status !== 'resolved' && c.assignedTechnicianIds?.includes(me?.id));
    }
    if (role === 'admin') return attentionCases;
    return [];
  }, [role, userName]);

  const openCases = useMemo(() => cases.filter((c) => c.status !== 'resolved'), [cases]);
  const resolvedCases = useMemo(() => cases.filter((c) => c.status === 'resolved'), [cases]);
  const shown = activeTab === 'open' ? openCases : resolvedCases;

  if (!role) return <Redirect href="/login" />;

  const isAdmin = role === 'admin';

  const openResolve = (item) => {
    setResolveTarget(item);
    setResolutionReason('');
    setResolveError('');
  };

  const confirmResolve = () => {
    if (resolutionReason.trim().length < 10) {
      setResolveError('Enter a resolution reason (at least 10 characters). This is required by the proposal.');
      return;
    }
    // PREVIEW ONLY — Chunk 8 persists the decision, keeps history, and
    // enforces that only administrators may resolve (verified by Firestore rules).
    setResolveTarget(null);
    Alert.alert(
      'Resolution recorded (preview)',
      'The case status and reason will be saved to Firestore in Milestone 8, together with the full case history.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title="Compliance attention"
        subtitle="Possible attention items from stored records, for administrative review"
        meta={`${openCases.length} open · ${resolvedCases.length} resolved`}
        right={<SignOutButton />}
      />
      <ScreenContainer>
        {/* Support scope — the limits, stated plainly */}
        <View style={styles.scope}>
          <Text style={styles.scopeLabel}>Support scope</Text>
          <Text style={styles.scopeText}>
            Cases are raised from a small predefined set of conditions. If information is missing or a record falls
            outside the supported scenario, it is labelled <Text style={styles.scopeStrong}>Needs Admin Review</Text>.
            This app is a recordkeeping and review aid — not an EPA-approved system.
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, activeTab === 'open' && styles.tabActive]} onPress={() => setActiveTab('open')} testID="tab-open">
            <Text style={[styles.tabLabel, activeTab === 'open' && styles.tabLabelActive]}>Open ({openCases.length})</Text>
          </Pressable>
          <Pressable style={[styles.tab, activeTab === 'resolved' && styles.tabActive]} onPress={() => setActiveTab('resolved')} testID="tab-resolved">
            <Text style={[styles.tabLabel, activeTab === 'resolved' && styles.tabLabelActive]}>Resolved ({resolvedCases.length})</Text>
          </Pressable>
        </View>

        {shown.length === 0 ? (
          <View style={styles.ledger}>
            <EmptyState
              title={activeTab === 'open' ? 'No open attention cases' : 'No resolved cases yet'}
              message={
                activeTab === 'open'
                  ? 'Everything is reviewed. New cases appear when a record meets a supported attention condition.'
                  : 'Cases you resolve with a recorded reason are kept here with their full history.'
              }
              testID="empty-compliance"
            />
          </View>
        ) : (
          shown.map((item) => {
            const unit = unitsById[item.unitId];
            const project = projectsById[item.projectId];
            const statusLabel = item.status === 'resolved' ? 'Resolved' : item.status === 'needs_review' ? 'Needs Admin Review' : 'Open';
            const tone = item.status === 'resolved' ? 'success' : item.severity ?? 'warning';

            return (
              <Card key={item.id} style={[styles.caseFile, { borderLeftColor: SEVERITY_COLORS[item.severity] ?? colors.warning }]} testID={`case-${item.id}`}>
                <View style={styles.caseHead}>
                  <Text style={styles.caseRef}>{item.id}</Text>
                  <StatusBadge label={statusLabel} tone={tone} />
                </View>
                <Text style={styles.caseTitle}>{item.title}</Text>
                <Text style={styles.caseMeta}>
                  <Text style={styles.caseMetaMono}>{item.unitId}</Text>
                  {unit ? `  ${unit.serialNumber}` : ''}
                </Text>
                <Text style={styles.caseProject}>{project?.name ?? ''}</Text>
                <Text style={styles.caseReason}>{item.reason}</Text>
                <Text style={styles.caseDate}>Raised {item.createdAt}</Text>

                {item.status === 'resolved' ? (
                  <View style={styles.resolutionBox}>
                    <Text style={styles.resolutionLabel}>Resolution by {item.resolvedBy}</Text>
                    <Text style={styles.resolutionText}>{item.resolutionReason}</Text>
                  </View>
                ) : null}

                <View style={styles.caseActions}>
                  <Button
                    label="View unit record"
                    variant="secondary"
                    size="sm"
                    onPress={() => router.push(`/units/${item.unitId}`)}
                    style={styles.caseAction}
                  />
                  {isAdmin && item.status !== 'resolved' ? (
                    <Button label="Resolve case" size="sm" onPress={() => openResolve(item)} style={styles.caseAction} testID={`btn-resolve-${item.id}`} />
                  ) : null}
                </View>

                {!isAdmin && item.status !== 'resolved' ? (
                  <Text style={styles.readonlyNote}>Only administrators can resolve or close a case.</Text>
                ) : null}
              </Card>
            );
          })
        )}

        <Text style={styles.historyNote}>
          Resolved cases keep their original reason, the administrator’s decision and the date — closing a case never
          deletes it.
        </Text>
      </ScreenContainer>

      {/* Admin resolve modal (preview validation) */}
      <Modal visible={resolveTarget !== null} transparent animationType="fade" onRequestClose={() => setResolveTarget(null)}>
        <Pressable style={styles.scrim} onPress={() => setResolveTarget(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Resolve case</Text>
            <Text style={styles.sheetSubtitle}>{resolveTarget?.title}</Text>
            <TextField
              label="Resolution reason (required)"
              value={resolutionReason}
              onChangeText={(v) => {
                setResolutionReason(v);
                if (resolveError) setResolveError('');
              }}
              placeholder="Explain what you checked and why the case can be closed…"
              multiline
              error={resolveError}
              testID="input-resolution"
            />
            <View style={styles.sheetActions}>
              <Button label="Cancel" variant="secondary" onPress={() => setResolveTarget(null)} style={styles.sheetAction} />
              <Button label="Confirm resolution" onPress={confirmResolve} style={styles.sheetAction} testID="btn-confirm-resolve" />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  scope: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  scopeLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 1,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  scopeText: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textSecondary, lineHeight: 17 },
  scopeStrong: { fontFamily: fonts.medium, color: colors.warning },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    padding: 3,
    marginTop: spacing.lg,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.navy900 },
  tabLabel: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textSecondary },
  tabLabelActive: { color: colors.textInverse },
  caseFile: { marginTop: spacing.md, borderLeftWidth: 3 },
  caseHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  caseRef: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    letterSpacing: 0.6,
    fontVariant: ['tabular-nums'],
  },
  caseTitle: { fontFamily: fonts.medium, fontSize: typography.sizeBodyLarge, color: colors.textPrimary, letterSpacing: -0.1, marginTop: spacing.sm, lineHeight: 21 },
  caseMeta: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: spacing.xs },
  caseMetaMono: { fontFamily: fonts.monoMedium, color: colors.textSecondary, letterSpacing: 0.2 },
  caseProject: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: 2 },
  caseReason: { fontFamily: fonts.regular, fontSize: typography.sizeBodySmall, color: colors.textSecondary, lineHeight: 18, marginTop: spacing.sm },
  caseDate: {
    fontFamily: fonts.mono,
    fontSize: typography.sizeMeta,
    color: colors.textMuted,
    letterSpacing: 0.4,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  resolutionBox: {
    backgroundColor: colors.successBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  resolutionLabel: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.success },
  resolutionText: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textSecondary, marginTop: spacing.xs, lineHeight: 17 },
  caseActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  caseAction: { flex: 1 },
  readonlyNote: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: spacing.md },
  historyNote: {
    fontFamily: fonts.regular,
    fontSize: typography.sizeCaption,
    color: colors.textMuted,
    lineHeight: 17,
    marginTop: spacing.xl,
  },
  scrim: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.xl,
  },
  sheetTitle: { fontFamily: fonts.medium, fontSize: typography.sizeBodyLarge, color: colors.textPrimary },
  sheetSubtitle: { fontFamily: fonts.regular, fontSize: typography.sizeBodySmall, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  sheetActions: { flexDirection: 'row', gap: spacing.md },
  sheetAction: { flex: 1 },
});
