/**
 * Projects screen — searchable list of company projects.
 * Admin: all projects plus a create command. Technician: active only.
 * Real CRUD arrives in Chunk 4; search and status filter work on sample data.
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
import { projects, units } from '../../src/data/sampleData';
import { colors, fonts, radius, spacing, typography } from '../../src/theme/theme';

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
];

export default function ProjectsScreen() {
  const router = useRouter();
  const { role } = useDemoSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const isAdmin = role === 'admin';

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    // Technicians only see active company projects (proposal requirement).
    return projects
      .filter((p) => (isAdmin ? true : p.status === 'active'))
      .filter((p) => (statusFilter === 'all' ? true : p.status === statusFilter))
      .filter(
        (p) =>
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.client.toLowerCase().includes(query) ||
          p.siteAddress.toLowerCase().includes(query)
      );
  }, [search, statusFilter, isAdmin]);

  // Demo-level guard: must be signed in at all (real guard arrives Chunk 2).
  if (!role) return <Redirect href="/login" />;

  const manageComingSoon = (action) =>
    Alert.alert(action, 'Project create, edit and deactivate connect to Firestore in Milestone 4.');

  const hasQuery = search.trim().length > 0 || statusFilter !== 'all';

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title="Projects"
        subtitle={isAdmin ? 'All commercial projects owned by your company' : 'Active projects for your company'}
        meta={`${visibleProjects.length} of ${projects.filter((p) => (isAdmin ? true : p.status === 'active')).length} shown`}
        right={<SignOutButton />}
      />
      <ScreenContainer>
        <View style={styles.controls}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search projects, clients, sites…" testID="search-projects" />
          <View style={styles.segmented}>
            {STATUS_FILTERS.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setStatusFilter(f.id)}
                style={[styles.segmentItem, statusFilter === f.id && styles.segmentItemActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: statusFilter === f.id }}
                testID={`filter-${f.id}`}
              >
                <Text style={[styles.segmentLabel, statusFilter === f.id && styles.segmentLabelActive]}>{f.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.ledger, styles.ledgerTop]}>
          {isAdmin ? (
            <ListRow
              first
              title="New project"
              meta="Create a commercial project for your company"
              accent
              onPress={() => manageComingSoon('New project')}
              trailing={<Ionicons name="add" size={20} color={colors.textAccent} />}
              testID="row-new-project"
            />
          ) : null}

          {visibleProjects.length === 0 ? (
            <EmptyState
              title={hasQuery ? 'No projects match your search' : 'No projects yet'}
              message={
                hasQuery
                  ? 'Adjust or clear the search and filters to see more results.'
                  : isAdmin
                    ? 'Create your first commercial project to begin registering equipment.'
                    : 'Your administrator has not created any projects yet.'
              }
              actionLabel={hasQuery ? 'Clear search & filters' : undefined}
              onAction={
                hasQuery
                  ? () => {
                      setSearch('');
                      setStatusFilter('all');
                    }
                  : undefined
              }
              testID="empty-projects"
            />
          ) : (
            visibleProjects.map((project, index) => (
              <ListRow
                key={project.id}
                first={!isAdmin && index === 0}
                title={project.name}
                meta={`${project.client} · ${project.siteAddress}`}
                meta2={`${units.filter((u) => u.projectId === project.id).length} registered units`}
                badge={
                  <StatusBadge
                    label={project.status === 'active' ? 'Active' : 'Inactive'}
                    tone={project.status === 'active' ? 'success' : 'neutral'}
                  />
                }
                onPress={() => router.push(`/projects/${project.id}`)}
                testID={`row-project-${project.id}`}
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
  segmentItemActive: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.hairlineStrong },
  segmentLabel: { fontFamily: fonts.medium, fontSize: typography.sizeCaption, color: colors.textSecondary },
  segmentLabelActive: { color: colors.textPrimary },
  ledgerTop: { marginTop: spacing.md },
  ledger: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
