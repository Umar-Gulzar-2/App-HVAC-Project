/**
 * Technician Service Form — record work performed on a registered unit.
 *
 * Flow: select project → select unit → choose service type → enter work
 * details. Required fields depend on the selected service type
 * (proposal requirement). Submitting validates the form; persistence to
 * Firestore arrives in Chunk 6 — this preview stores nothing yet.
 *
 * Optional param: ?unitId=ACU-… preselects the unit (from Unit Details).
 */
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import ScreenContainer from '../../src/components/ScreenContainer';
import SignOutButton from '../../src/components/SignOutButton';
import TextField from '../../src/components/TextField';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModelsById, projects, units } from '../../src/data/sampleData';
import { colors, radius, spacing, typography } from '../../src/theme/theme';

const SERVICE_TYPES = ['Installation', 'Repair', 'Maintenance', 'Refrigerant Service', 'Replacement'];

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
        title="Service Record"
        subtitle="Record installation, repair, maintenance, refrigerant or replacement work"
        right={<SignOutButton />}
      />
      <ScreenContainer>
        {/* Selectors */}
        <Card style={styles.section}>
          <Pressable style={styles.selector} onPress={() => setPicker('project')} testID="select-project">
            <View style={styles.selectorBody}>
              <Text style={styles.selectorLabel}>Project</Text>
              <Text style={[styles.selectorValue, !selectedProject && styles.selectorPlaceholder]}>
                {selectedProject ? selectedProject.name : 'Select a project…'}
              </Text>
            </View>
            <Text style={styles.chevron}>▾</Text>
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
              <Text style={styles.selectorLabel}>AC Unit</Text>
              <Text style={[styles.selectorValue, !selectedUnit && styles.selectorPlaceholder]}>
                {selectedUnit ? `${selectedUnit.id} · ${selectedUnit.serialNumber}` : projectId ? 'Select a unit…' : 'Choose a project first'}
              </Text>
            </View>
            <Text style={styles.chevron}>▾</Text>
          </Pressable>
          {errors.unitId ? <Text style={styles.error}>{errors.unitId}</Text> : null}

          {selectedUnit ? (
            <Text style={styles.unitMeta}>
              {selectedModel?.manufacturer} {selectedModel?.modelNumber} · {selectedUnit.refrigerantType} · full charge {selectedUnit.fullChargeLbs} lbs
            </Text>
          ) : null}
        </Card>

        {/* Service type */}
        <Text style={styles.groupLabel}>Service type</Text>
        <View style={styles.typeGrid}>
          {SERVICE_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() => {
                setServiceType(type);
                setErrors((e) => ({ ...e, serviceType: undefined }));
              }}
              style={[styles.typeChip, serviceType === type && styles.typeChipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: serviceType === type }}
              testID={`type-${type}`}
            >
              <Text style={[styles.typeLabel, serviceType === type && styles.typeLabelActive]}>{type}</Text>
            </Pressable>
          ))}
        </View>
        {errors.serviceType ? <Text style={styles.error}>{errors.serviceType}</Text> : null}

        {/* Work details */}
        <View style={styles.formBlock}>
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
            placeholder="Pressure/vacuum test results, readings, follow-up needed…"
            multiline
            testID="input-notes"
          />
        </View>

        <Button label="Save Service Record" size="lg" onPress={handleSubmit} loading={saving} testID="btn-save-service" />
        <Text style={styles.previewNote}>Preview build — validation works; Firestore saving connects in Milestone 6.</Text>
      </ScreenContainer>

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
                    <Text style={styles.sheetItemText}>{u.id}</Text>
                    <Text style={styles.sheetItemMeta}>
                      {u.serialNumber} · {acModelsById[u.modelId]?.manufacturer} {acModelsById[u.modelId]?.modelNumber}
                    </Text>
                  </Pressable>
                ))}
            <Button label="Close" variant="ghost" onPress={() => setPicker(null)} style={styles.sheetClose} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  section: { marginTop: spacing.lg },
  selector: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  selectorDisabled: { opacity: 0.55 },
  selectorBody: { flex: 1 },
  selectorLabel: { fontSize: typography.sizeOverline, fontWeight: typography.semibold, color: colors.textMuted, letterSpacing: 0.6, textTransform: 'uppercase' },
  selectorValue: { fontSize: typography.sizeBody, fontWeight: typography.medium, color: colors.textPrimary, marginTop: 3 },
  selectorPlaceholder: { color: colors.textMuted, fontWeight: typography.regular },
  selectorDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  chevron: { fontSize: 16, color: colors.textMuted, paddingLeft: spacing.md },
  error: { fontSize: typography.sizeCaption, color: colors.danger, marginTop: spacing.xs },
  unitMeta: { fontSize: typography.sizeCaption, color: colors.textSecondary, marginTop: spacing.sm },
  groupLabel: {
    fontSize: typography.sizeOverline,
    fontWeight: typography.bold,
    letterSpacing: 1.2,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeChip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  typeChipActive: { backgroundColor: colors.navy800, borderColor: colors.navy800 },
  typeLabel: { fontSize: typography.sizeCaption, fontWeight: typography.medium, color: colors.textSecondary },
  typeLabelActive: { color: colors.textInverse, fontWeight: typography.semibold },
  formBlock: { marginTop: spacing.xl },
  previewNote: { fontSize: typography.sizeCaption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
  scrim: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: spacing.xl,
    maxHeight: '75%',
  },
  sheetTitle: { fontSize: typography.sizeBodyLarge, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  sheetItem: { paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  sheetItemText: { fontSize: typography.sizeBody, fontWeight: typography.semibold, color: colors.textPrimary },
  sheetItemMeta: { fontSize: typography.sizeCaption, color: colors.textSecondary, marginTop: 2 },
  sheetClose: { marginTop: spacing.md },
});
