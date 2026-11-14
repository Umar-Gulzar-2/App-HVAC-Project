/**
 * Service Records screen (administrator) — company-wide view of recorded work.
 * Filter by project, unit, technician, service type and date range; search
 * within results. Company-level isolation is enforced in Chunk 2 with
 * Firestore security rules; this preview filters the sample dataset.
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import Chip from '../../src/components/Chip';
import EmptyState from '../../src/components/EmptyState';
import ListRow from '../../src/components/ListRow';
import ScreenContainer from '../../src/components/ScreenContainer';
import SearchBar from '../../src/components/SearchBar';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import TextField from '../../src/components/TextField';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { projects, projectsById, serviceRecords, technicians, techniciansById, unitsById } from '../../src/data/sampleData';
import { colors, radius, spacing, typography } from '../../src/theme/theme';

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
        title="Service Records"
        subtitle={`${serviceRecords.length} records across your company · ${filtered.length} shown`}
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
              label={advancedActive ? 'Filters · active' : 'Filters'}
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

        {filtered.length === 0 ? (
          <Card style={styles.listCard}>
            <EmptyState
              title="No records match these filters"
              message="Change or clear the filters to see more of your company’s service history."
              actionLabel="Clear all filters"
              onAction={clearAll}
              testID="empty-records"
            />
          </Card>
        ) : (
          <Card padded={false} style={styles.listCard}>
            {filtered.map((record, index) => (
              <ListRow
                key={record.id}
                first={index === 0}
                title={`${record.date} · ${record.serviceType}`}
                meta={`${record.unitId} — ${unitsById[record.unitId]?.serialNumber ?? ''}`}
                meta2={`${projectsById[record.projectId]?.name ?? ''} · ${techniciansById[record.technicianId]?.name ?? 'Unknown'}`}
                badge={<StatusBadge label={record.serviceType.split(' ')[0]} tone="neutral" />}
                onPress={() => router.push(`/units/${record.unitId}`)}
                testID={`row-record-${record.id}`}
              />
            ))}
          </Card>
        )}
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
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  controls: { marginTop: spacing.lg },
  chipRow: { marginTop: spacing.md },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  listCard: { marginTop: spacing.md },
  scrim: { flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  sheetTitle: { fontSize: typography.sizeBodyLarge, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.md },
  sheetScroll: { flexGrow: 0 },
  fieldLabel: {
    fontSize: typography.sizeOverline,
    fontWeight: typography.bold,
    letterSpacing: 1,
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
