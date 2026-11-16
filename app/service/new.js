/**
 * Technician Service Form — record work performed on a registered unit.
 *
 * Numbered sections (01–03) follow the real sequence of the task:
 * equipment → service type → work details. Required fields depend on the
 * selected service type (proposal requirement). Submitting validates the
 * form; persistence to Firestore arrives in Chunk 6 — nothing is stored yet.
 *
 * Optional param: ?unitId=ACU-… preselects the unit (from Unit Details).
 */
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActionBar from '../../src/components/ActionBar';
import AppHeader from '../../src/components/AppHeader';
import ScreenContainer from '../../src/components/ScreenContainer';
import SignOutButton from '../../src/components/SignOutButton';
import TextField from '../../src/components/TextField';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModelsById, projects, units } from '../../src/data/sampleData';
import { colors, fonts, radius, shadows, spacing, typography } from '../../src/theme/theme';

const SERVICE_TYPES = [
  { name: 'Installation', icon: 'construct-outline' },
  { name: 'Repair', icon: 'build-outline' },
  { name: 'Maintenance', icon: 'medkit-outline' },
  { name: 'Refrigerant Service', icon: 'snow-outline' },
  { name: 'Replacement', icon: 'swap-horizontal-outline' },
];

const WORK_PLACEHOLDERS = {
  Installation: 'Describe the installation or commissioning work performed…',
  Repair: 'Describe the repair work performed…',
  Maintenance: 'Describe the preventive maintenance performed…',
  'Refrigerant Service': 'Describe the refrigerant service performed…',
  Replacement: 'Describe what was replaced and the work performed…',
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Section heading: mono sequence number + sentence-case name. */
function FormSection({ index, title, count }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionIndex}>{index}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      {count ? <Text style={styles.sectionCount}>{count}</Text> : null}
    </View>
  );
}

export default function ServiceFormScreen() {
  const router = useRouter();
  const { unitId: presetUnitId } = useLocalSearchParams();
  const { role } = useDemoSession();

  const [projectId, setProjectId] = useState(presetUnitId ? units.find((u) => u.id === presetUnitId)?.projectId ?? '' : '');
  const [unitId, setUnitId] = useState(presetUnitId ?? '');
  const [serviceType, setServiceType] = useState('');
  const [serviceDate, setServiceDate] = useState(todayIso());
  const [workPerformed, setWorkPerformed] = useState('');
  const [refrigerantQuantity, setRefrigerantQuantity] = useState('');
  const [leakRepairInfo, setLeakRepairInfo] = useState('');
  const [testNotes, setTestNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [picker, setPicker] = useState(null); // 'project' | 'unit' | null
  const [saving, setSaving] = useState(false);

  const projectUnits = useMemo(() => units.filter((u) => u.projectId === projectId), [projectId]);
  const selectedProject = projects.find((p) => p.id === projectId);
  const selectedUnit = units.find((u) => u.id === unitId);
  const selectedModel = selectedUnit ? acModelsById[selectedUnit.modelId] : null;

  const needsRefrigerantFields = serviceType === 'Refrigerant Service';
  const needsLeakFields = serviceType === 'Refrigerant Service' || serviceType === 'Repair';

  // Demo-level guard: only technicians record service work (proposal).
  if (role !== 'technician') {
    return <Redirect href={role === 'admin' ? '/admin' : '/login'} />;
  }

  const chooseProject = (id) => {
    setProjectId(id);
    setUnitId('');
    setPicker(null);
    setErrors((e) => ({ ...e, projectId: undefined, unitId: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!projectId) next.projectId = 'Select the project where the work was performed.';
    if (!unitId) next.unitId = 'Select the unit that was serviced.';
    if (!serviceType) next.serviceType = 'Select a service type.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(serviceDate)) next.serviceDate = 'Use the format YYYY-MM-DD.';
    if (workPerformed.trim().length < 10) next.workPerformed = 'Describe the work performed (at least 10 characters).';
    if (needsRefrigerantFields) {
      const qty = Number(refrigerantQuantity);
      if (!refrigerantQuantity.trim() || Number.isNaN(qty) || qty <= 0) {
        next.refrigerantQuantity = 'Enter the refrigerant quantity added in lbs (greater than 0).';
      }
    }
    if (needsLeakFields && leakRepairInfo.trim().length < 5) {
      next.leakRepairInfo = 'Enter leak/repair details for this service type.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);
    // PREVIEW ONLY — no data is stored yet. Chunk 6 writes the record to
    // Firestore as a new immutable document linked to company/project/unit.
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        'Service record captured (preview)',
        `${serviceType} for ${unitId} on ${serviceDate} passed validation.\n\nSaving to Firestore connects in Milestone 6, when the record will be added to this unit’s permanent history.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 300);
  };

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title="Service record"
        subtitle="Installation, repair, maintenance, refrigerant or replacement work"
        meta="Preview · not saved yet"
        right={<SignOutButton />}
      />
      <ScreenContainer contentStyle={styles.content}>
        {/* 01 — Equipment */}
        <FormSection index="01" title="Equipment" />
        <View style={styles.block}>
          <Pressable style={styles.selector} onPress={() => setPicker('project')} testID="select-project">
            <View style={styles.selectorBody}>
              <Text style={styles.selectorLabel}>Project</Text>
              <Text style={[styles.selectorValue, !selectedProject && styles.selectorPlaceholder]}>
                {selectedProject ? selectedProject.name : 'Select a project…'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
          {errors.projectId ? <Text style={styles.error}>{errors.projectId}</Text> : null}

          <View style={styles.selectorDivider} />

          <Pressable
            style={[styles.selector, !projectId && styles.selectorDisabled]}
            onPress={() => projectId && setPicker('unit')}
            disabled={!projectId}
            testID="select-unit"
          >
            <View style={styles.selectorBody}>
              <Text style={styles.selectorLabel}>AC unit</Text>
              <Text style={[styles.selectorValue, !selectedUnit && styles.selectorPlaceholder]}>
                {selectedUnit ? `${selectedUnit.id} · ${selectedUnit.serialNumber}` : projectId ? 'Select a unit…' : 'Choose a project first'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
          </Pressable>
          {errors.unitId ? <Text style={styles.error}>{errors.unitId}</Text> : null}

          {selectedUnit ? (
            <Text style={styles.unitMeta}>
              {selectedModel?.manufacturer} {selectedModel?.modelNumber} · {selectedUnit.refrigerantType} · full charge{' '}
              {selectedUnit.fullChargeLbs} lbs
            </Text>
          ) : null}
        </View>

        {/* 02 — Service type */}
        <FormSection index="02" title="Service type" />
        <View style={styles.typeGrid}>
          {SERVICE_TYPES.map((type) => {
            const selected = serviceType === type.name;
            return (
              <Pressable
                key={type.name}
                onPress={() => {
                  setServiceType(type.name);
                  setErrors((e) => ({ ...e, serviceType: undefined }));
                }}
                style={[styles.typeTile, selected && styles.typeTileActive]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                testID={`type-${type.name}`}
              >
                <Ionicons name={type.icon} size={18} color={selected ? colors.blue600 : colors.textSecondary} />
                <Text style={[styles.typeLabel, selected && styles.typeLabelActive]}>{type.name}</Text>
              </Pressable>
            );
          })}
        </View>
        {errors.serviceType ? <Text style={styles.error}>{errors.serviceType}</Text> : null}

        {/* 03 — Work details */}
        <FormSection index="03" title="Work details" />
        <View style={styles.block}>
          <TextField label="Service date (YYYY-MM-DD)" value={serviceDate} onChangeText={setServiceDate} error={errors.serviceDate} testID="input-date" />
          <TextField
            label="Work performed"
            value={workPerformed}
            onChangeText={setWorkPerformed}
            placeholder={WORK_PLACEHOLDERS[serviceType] ?? 'Describe the work performed…'}
            multiline
            error={errors.workPerformed}
            testID="input-work"
          />

          {needsRefrigerantFields ? (
            <TextField
              label="Refrigerant quantity added (lbs)"
              value={refrigerantQuantity}
              onChangeText={setRefrigerantQuantity}
              placeholder="e.g. 9.5"
              keyboardType="decimal-pad"
              error={errors.refrigerantQuantity}
              helperText={`Unit full charge: ${selectedUnit ? `${selectedUnit.fullChargeLbs} lbs` : 'see unit details'}`}
              testID="input-qty"
            />
          ) : null}

          {needsLeakFields ? (
            <TextField
              label={serviceType === 'Repair' ? 'Leak / repair information' : 'Leak information & repair performed'}
              value={leakRepairInfo}
              onChangeText={setLeakRepairInfo}
              placeholder="Describe any leak found, parts replaced, joints repaired…"
              multiline
              error={errors.leakRepairInfo}
              testID="input-leak"
            />
          ) : null}

          <TextField
            label={needsLeakFields ? 'Test notes (optional)' : 'Notes (optional)'}
            value={testNotes}
            onChangeText={setTestNotes}
            placeholder="Pressure or vacuum test results, readings, follow-up needed…"
            multiline
            testID="input-notes"
          />
        </View>

        <Text style={styles.previewNote}>Validation runs locally — Firestore saving connects in Milestone 6</Text>
      </ScreenContainer>

      <ActionBar label="Save service record" onPress={handleSubmit} loading={saving} testID="btn-save-service" />

      {/* Simple selection modal (project / unit) */}
      <Modal visible={picker !== null} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.scrim} onPress={() => setPicker(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>{picker === 'project' ? 'Select project' : 'Select AC unit'}</Text>
            {picker === 'project'
              ? projects.filter((p) => p.status === 'active').map((p) => (
                  <Pressable key={p.id} style={styles.sheetItem} onPress={() => chooseProject(p.id)} testID={`option-project-${p.id}`}>
                    <Text style={styles.sheetItemText}>{p.name}</Text>
                    <Text style={styles.sheetItemMeta}>{p.client}</Text>
                  </Pressable>
                ))
              : projectUnits.map((u) => (
                  <Pressable
                    key={u.id}
                    style={styles.sheetItem}
                    onPress={() => {
                      setUnitId(u.id);
                      setPicker(null);
                      setErrors((e) => ({ ...e, unitId: undefined }));
                    }}
                    testID={`option-unit-${u.id}`}
                  >
                    <Text style={styles.sheetItemTextMono}>{u.id}</Text>
                    <Text style={styles.sheetItemMeta}>
                      {u.serialNumber} · {acModelsById[u.modelId]?.manufacturer} {acModelsById[u.modelId]?.modelNumber}
                    </Text>
                  </Pressable>
                ))}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingTop: spacing.lg },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.sm },
  sectionIndex: { fontFamily: fonts.monoMedium, fontSize: typography.sizeCaption, color: colors.textAccent, letterSpacing: 0.5 },
  sectionTitle: { fontFamily: fonts.medium, fontSize: typography.sizeBody, color: colors.textPrimary, letterSpacing: -0.1 },
  sectionCount: { fontFamily: fonts.mono, fontSize: typography.sizeCaption, color: colors.textMuted, marginLeft: 'auto' },
  block: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  selector: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, minHeight: 48 },
  selectorDisabled: { opacity: 0.55 },
  selectorBody: { flex: 1, paddingRight: spacing.sm },
  selectorLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  selectorValue: { fontFamily: fonts.medium, fontSize: typography.sizeBody, color: colors.textPrimary, marginTop: 3 },
  selectorPlaceholder: { fontFamily: fonts.regular, color: colors.textMuted },
  selectorDivider: { height: 1, backgroundColor: colors.hairline },
  error: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.danger, marginTop: spacing.xs, marginBottom: spacing.xs },
  unitMeta: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textSecondary, paddingVertical: spacing.sm, lineHeight: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 44,
    flexGrow: 1,
    minWidth: '47%',
  },
  typeTileActive: { backgroundColor: colors.blue050, borderColor: colors.blue600 },
  typeLabel: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textSecondary, flexShrink: 1 },
  typeLabelActive: { color: colors.textPrimary },
  previewNote: {
    fontFamily: fonts.mono,
    fontSize: typography.sizeMeta,
    letterSpacing: 0.5,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    textTransform: 'uppercase',
  },
  scrim: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.xl,
    maxHeight: '75%',
    ...shadows.sheet,
  },
  sheetTitle: { fontFamily: fonts.medium, fontSize: typography.sizeBodyLarge, color: colors.textPrimary, marginBottom: spacing.sm },
  sheetItem: { paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.hairline },
  sheetItemText: { fontFamily: fonts.medium, fontSize: typography.sizeBody, color: colors.textPrimary },
  sheetItemTextMono: { fontFamily: fonts.monoMedium, fontSize: typography.sizeBody, color: colors.textPrimary, letterSpacing: 0.2 },
  sheetItemMeta: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: 2 },
});
