/**
 * AC Models screen (administrator) — reusable equipment model entries.
 * Search + list layout work now; create/edit/deactivate CRUD connects to
 * Firestore in Chunk 4.
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Card from '../../src/components/Card';
import Chip from '../../src/components/Chip';
import EmptyState from '../../src/components/EmptyState';
import ListRow from '../../src/components/ListRow';
import ScreenContainer from '../../src/components/ScreenContainer';
import SearchBar from '../../src/components/SearchBar';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModels, units } from '../../src/data/sampleData';
import { colors, spacing } from '../../src/theme/theme';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
];

export default function AcModelsScreen() {
  const router = useRouter();
  const { role } = useDemoSession();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return acModels
      .filter((m) => (filter === 'all' ? true : m.status === filter))
      .filter((m) => !query || m.manufacturer.toLowerCase().includes(query) || m.modelNumber.toLowerCase().includes(query) || m.equipmentType.toLowerCase().includes(query));
  }, [search, filter]);

  // Demo-level guard (real Firebase protection arrives in Chunk 2).
  if (role !== 'admin') return <Redirect href={role === 'technician' ? '/technician' : '/login'} />;

  const comingSoon = (action) => Alert.alert(action, 'Model create/edit/deactivate connects to Firestore in Milestone 4.');

  return (
    <View style={styles.page}>
      <AppHeader variant="page" title="AC Models" subtitle="Reusable manufacturer & model entries for registering equipment" right={<SignOutButton />} />
      <ScreenContainer>
        <View style={styles.controls}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search manufacturer, model, type…" testID="search-models" />
          <View style={styles.chipRow}>
            {FILTERS.map((f) => (
              <Chip key={f.id} label={f.label} selected={filter === f.id} onPress={() => setFilter(f.id)} />
            ))}
          </View>
        </View>

        <Card style={styles.addCard}>
          <ListRow title="＋ New AC Model" meta="Add a manufacturer, model number and equipment type" onPress={() => comingSoon('New AC model')} testID="row-new-model" />
        </Card>

        {visible.length === 0 ? (
          <Card style={styles.listCard}>
            <EmptyState title="No models match your search" message="Adjust the search or filters to find a model entry." testID="empty-models" />
          </Card>
        ) : (
          <Card padded={false} style={styles.listCard}>
            {visible.map((model, index) => (
              <ListRow
                key={model.id}
                first={index === 0}
                title={`${model.manufacturer} ${model.modelNumber}`}
                meta={model.equipmentType}
                meta2={`${units.filter((u) => u.modelId === model.id).length} registered units`}
                badge={<StatusBadge label={model.status === 'active' ? 'Active' : 'Inactive'} tone={model.status === 'active' ? 'success' : 'neutral'} />}
                onPress={() => comingSoon('Edit model')}
                testID={`row-model-${model.id}`}
              />
            ))}
          </Card>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  controls: { marginTop: spacing.lg },
  chipRow: { flexDirection: 'row', marginTop: spacing.md },
  addCard: { marginTop: spacing.md },
  listCard: { marginTop: spacing.md },
});
