/**
 * AC Models screen (administrator) — reusable equipment model entries.
 * Model number leads in mono (engineers search by model), manufacturer and
 * equipment type follow. CRUD connects to Firestore in Chunk 4.
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../src/components/AppHeader';
import EmptyState from '../../src/components/EmptyState';
import ListRow from '../../src/components/ListRow';
import ScreenContainer from '../../src/components/ScreenContainer';
import SearchBar from '../../src/components/SearchBar';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModels, units } from '../../src/data/sampleData';
import { colors, fonts, radius, spacing, typography } from '../../src/theme/theme';

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
      .filter(
        (m) =>
          !query ||
          m.manufacturer.toLowerCase().includes(query) ||
          m.modelNumber.toLowerCase().includes(query) ||
          m.equipmentType.toLowerCase().includes(query)
      );
  }, [search, filter]);

  // Demo-level guard (real Firebase protection arrives in Chunk 2).
  if (role !== 'admin') return <Redirect href={role === 'technician' ? '/technician' : '/login'} />;

  const comingSoon = (action) => Alert.alert(action, 'Model create, edit and deactivate connect to Firestore in Milestone 4.');

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title="AC models"
        subtitle="Reusable manufacturer and model entries used when registering equipment"
        meta={`${visible.length} of ${acModels.length} shown`}
        right={<SignOutButton />}
      />
      <ScreenContainer>
        <View style={styles.controls}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search manufacturer, model, type…" testID="search-models" />
          <View style={styles.segmented}>
            {FILTERS.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[styles.segmentItem, filter === f.id && styles.segmentItemActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === f.id }}
                testID={`filter-${f.id}`}
              >
                <Text style={[styles.segmentLabel, filter === f.id && styles.segmentLabelActive]}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.ledger}>
          <ListRow
            first
            title="New model"
            meta="Add a manufacturer, model number and equipment type"
            accent
            onPress={() => comingSoon('New model')}
            trailing={<Ionicons name="add" size={20} color={colors.textAccent} />}
            testID="row-new-model"
          />

          {visible.length === 0 ? (
            <EmptyState title="No models match your search" message="Adjust the search or filters to find a model entry." testID="empty-models" />
          ) : (
            visible.map((model) => (
              <ListRow
                key={model.id}
                title={model.modelNumber}
                monoTitle
                meta={`${model.manufacturer} · ${model.equipmentType}`}
                meta2={`${units.filter((u) => u.modelId === model.id).length} registered units`}
                badge={<StatusBadge label={model.status === 'active' ? 'Active' : 'Inactive'} tone={model.status === 'active' ? 'success' : 'neutral'} />}
                onPress={() => comingSoon('Edit model')}
                testID={`row-model-${model.id}`}
              />
            ))
          )}
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  controls: { marginTop: spacing.lg },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    padding: 3,
    marginTop: spacing.md,
  },
  segmentItem: { flex: 1, paddingVertical: 7, borderRadius: radius.sm, alignItems: 'center' },
  segmentItemActive: { backgroundColor: colors.navy900 },
  segmentLabel: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textSecondary },
  segmentLabelActive: { color: colors.textInverse },
  ledger: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
