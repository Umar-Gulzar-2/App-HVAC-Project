/**
 * Service Records screen (administrator) — company-wide logbook.
 * Rows read like a log: mono date, status tag, unit + serial, project and
 * technician. Filter by project, unit, technician, service type and date
 * range; search within results. Company isolation is enforced by Firestore
 * security rules in Chunk 2; this preview filters the sample dataset.
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Button from '../../src/components/Button';
import Chip from '../../src/components/Chip';
import EmptyState from '../../src/components/EmptyState';
import ScreenContainer from '../../src/components/ScreenContainer';
import SearchBar from '../../src/components/SearchBar';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import TextField from '../../src/components/TextField';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { projects, projectsById, serviceRecords, technicians, techniciansById, unitsById } from '../../src/data/sampleData';
import { colors, fonts, radius, spacing, typography } from '../../src/theme/theme';

const TYPE_FILTERS = ['All', 'Installation', 'Repair', 'Maintenance', 'Refrigerant Service', 'Replacement'];

export default function RecordsScreen() {
  const router = useRouter();
  const { role } = useDemoSession();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [projectId, setProjectId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...serviceRecords]
      .filter((r) => (typeFilter === 'All' ? true : r.serviceType === typeFilter))
      .filter((r) => (projectId ? r.projectId === projectId : true))
      .filter((r) => (technicianId ? r.technicianId === technicianId : true))
      .filter((r) => (dateFrom ? r.date >= dateFrom : true))
      .filter((r) => (dateTo ? r.date <= dateTo : true))
      .filter((r) => {
        if (!query) return true;
        const unit = unitsById[r.unitId];
        return (
          r.unitId.toLowerCase().includes(query) ||
          (unit?.serialNumber ?? '').toLowerCase().includes(query) ||
          r.workPerformed.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [search, typeFilter, projectId, technicianId, dateFrom, dateTo]);

  const advancedActive = Boolean(projectId || technicianId || dateFrom || dateTo);
  const activeFilterCount = (projectId ? 1 : 0) + (technicianId ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  // Demo-level guard (real Firebase protection arrives in Chunk 2).
  if (role !== 'admin') return <Redirect href={role === 'technician' ? '/technician' : '/login'} />;

  const clearAll = () => {
    setSearch('');
    setTypeFilter('All');
    setProjectId('');
    setTechnicianId('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title="Service records"
        subtitle={`${serviceRecords.length} records across your company · ${filtered.length} shown`}
        meta="Company-wide · newest first"
        right={<SignOutButton />}
      />
      <ScreenContainer>
        <View style={styles.controls}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search unit ID, serial or work text…" testID="search-records" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {TYPE_FILTERS.map((type) => (
              <Chip key={type} label={type} selected={typeFilter === type} onPress={() => setTypeFilter(type)} />
            ))}
          </ScrollView>
          <View style={styles.filterRow}>
            <Button
              label={activeFilterCount > 0 ? `Filters · ${activeFilterCount}` : 'Filters'}
              variant="secondary"
              size="sm"
              onPress={() => setShowFilters(true)}
              testID="btn-filters"
            />
            {advancedActive || typeFilter !== 'All' || search ? (
              <Button label="Clear all" variant="ghost" size="sm" onPress={clearAll} testID="btn-clear-filters" />
            ) : null}
          </View>
        </View>

        <View style={styles.ledger}>
          {filtered.length === 0 ? (
            <EmptyState
              title="No records match these filters"
              message="Change or clear the filters to see more of your company’s service history."
              actionLabel="Clear all filters"
              onAction={clearAll}
              testID="empty-records"
            />
          ) : (
            filtered.map((record, index) => {
              const unit = unitsById[record.unitId];
              const typeTone =
                record.serviceType === 'Refrigerant Service'
                  ? 'danger'
                  : record.serviceType === 'Repair'
                    ? 'warning'
                    : record.serviceType === 'Installation'
                      ? 'info'
                      : 'neutral';
              return (
                <Pressable
                  key={record.id}
                  onPress={() => router.push(`/units/${record.unitId}`)}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.recordRow, index > 0 && styles.recordDivider, pressed && styles.recordPressed]}
                  testID={`row-record-${record.id}`}
                >
                  <View style={styles.recordHead}>
                    <Text style={styles.recordDate}>{record.date}</Text>
                    <StatusBadge label={record.serviceType} tone={typeTone} dot={false} />
                  </View>
                  <Text style={styles.recordUnit} numberOfLines={1}>
                    {record.unitId}
                    <Text style={styles.recordSerial}>   {unit?.serialNumber ?? ''}</Text>
                  </Text>
                  <Text style={styles.recordMeta} numberOfLines={1}>
                    {projectsById[record.projectId]?.name ?? ''} · {techniciansById[record.technicianId]?.name ?? 'Unknown'}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>
      </ScreenContainer>

      {/* Advanced filters modal */}
      <Modal visible={showFilters} transparent animationType="fade" onRequestClose={() => setShowFilters(false)}>
        <Pressable style={styles.scrim} onPress={() => setShowFilters(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Filter records</Text>
            <ScrollView style={styles.sheetScroll}>
              <Text style={styles.fieldLabel}>Project</Text>
              <View style={styles.pickerRow}>
                <Chip label="All projects" selected={!projectId} onPress={() => setProjectId('')} />
                {projects.map((p) => (
                  <Chip key={p.id} label={p.name.split(' — ')[0]} selected={projectId === p.id} onPress={() => setProjectId(p.id)} />
                ))}
              </View>

              <Text style={styles.fieldLabel}>Technician</Text>
              <View style={styles.pickerRow}>
                <Chip label="All technicians" selected={!technicianId} onPress={() => setTechnicianId('')} />
                {technicians
                  .filter((t) => t.role === 'technician')
                  .map((t) => (
                    <Chip key={t.id} label={t.name} selected={technicianId === t.id} onPress={() => setTechnicianId(t.id)} />
                  ))}
              </View>

              <Text style={styles.fieldLabel}>Date range</Text>
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <TextField label="From" value={dateFrom} onChangeText={setDateFrom} placeholder="YYYY-MM-DD" testID="date-from" />
                </View>
                <View style={styles.dateField}>
                  <TextField label="To" value={dateTo} onChangeText={setDateTo} placeholder="YYYY-MM-DD" testID="date-to" />
                </View>
              </View>
            </ScrollView>
            <View style={styles.sheetActions}>
              <Button label="Clear" variant="secondary" onPress={clearAll} style={styles.sheetAction} />
              <Button label="Show results" onPress={() => setShowFilters(false)} style={styles.sheetAction} testID="btn-apply-filters" />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  controls: { marginTop: spacing.lg },
  chipRow: { marginTop: spacing.md },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  ledger: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  recordRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 52 },
  recordDivider: { borderTopWidth: 1, borderTopColor: colors.hairline },
  recordPressed: { backgroundColor: colors.canvas },
  recordHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  recordDate: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeBody,
    color: colors.textPrimary,
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  recordUnit: { fontFamily: fonts.monoMedium, fontSize: typography.sizeCaption, color: colors.textSecondary, marginTop: 5, letterSpacing: 0.2 },
  recordSerial: { fontFamily: fonts.mono, fontSize: typography.sizeCaption, color: colors.textMuted, letterSpacing: 0.2 },
  recordMeta: { fontFamily: fonts.regular, fontSize: typography.sizeCaption, color: colors.textMuted, marginTop: 3, lineHeight: 16 },
  scrim: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  sheetTitle: { fontFamily: fonts.medium, fontSize: typography.sizeBodyLarge, color: colors.textPrimary, marginBottom: spacing.sm },
  sheetScroll: { flexGrow: 0 },
  fieldLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: typography.sizeMeta,
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  dateRow: { flexDirection: 'row', gap: spacing.md },
  dateField: { flex: 1 },
  sheetActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  sheetAction: { flex: 1 },
});
