/**
 * Projects screen — searchable list of company projects.
 * Admin: sees all projects and management actions.
 * Technician: sees active projects only (read view).
 * Real CRUD arrives in Chunk 4; search + status filter work on sample data now.
 */
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
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
import { projects, units } from '../../src/data/sampleData';
import { colors, spacing } from '../../src/theme/theme';

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
      .filter((p) => !query || p.name.toLowerCase().includes(query) || p.client.toLowerCase().includes(query) || p.siteAddress.toLowerCase().includes(query));
  }, [search, statusFilter, isAdmin]);

  // Demo-level guard: must be signed in at all (real guard arrives Chunk 2).
  if (!role) return <Redirect href="/login" />;

  const manageComingSoon = (action) =>
    Alert.alert(action, 'Project create/edit/deactivate connects to Firestore in Milestone 4.');

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title="Projects"
        subtitle={isAdmin ? 'All commercial projects owned by your company' : 'Active projects for your company'}
        right={<SignOutButton />}
      />
      <ScreenContainer>
        <View style={styles.controls}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search projects, clients, sites…" testID="search-projects" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {STATUS_FILTERS.map((f) => (
              <Chip key={f.id} label={f.label} selected={statusFilter === f.id} onPress={() => setStatusFilter(f.id)} />
            ))}
          </ScrollView>
        </View>

        {isAdmin ? (
          <Card style={styles.addCard}>
            <ListRow title="＋ New Project" meta="Create a commercial project for your company" onPress={() => manageComingSoon('New project')} testID="row-new-project" />
          </Card>
        ) : null}

        {visibleProjects.length === 0 ? (
          <Card style={styles.listCard}>
            <EmptyState
              title={search || statusFilter !== 'all' ? 'No projects match your search' : 'No projects yet'}
              message={
                search || statusFilter !== 'all'
                  ? 'Adjust or clear the search and filters to see more results.'
                  : isAdmin
                    ? 'Create your first commercial project to begin registering equipment.'
                    : 'Your administrator has not created any projects yet.'
              }
              actionLabel={search || statusFilter !== 'all' ? 'Clear search & filters' : undefined}
              onAction={
                search || statusFilter !== 'all'
                  ? () => {
                      setSearch('');
                      setStatusFilter('all');
                    }
                  : undefined
              }
              testID="empty-projects"
            />
          </Card>
        ) : (
          <Card padded={false} style={styles.listCard}>
            {visibleProjects.map((project, index) => (
              <ListRow
                key={project.id}
                first={index === 0}
                title={project.name}
                meta={`${project.client} · ${project.siteAddress}`}
                meta2={`${units.filter((u) => u.projectId === project.id).length} registered units`}
                badge={<StatusBadge label={project.status === 'active' ? 'Active' : 'Inactive'} tone={project.status === 'active' ? 'success' : 'neutral'} />}
                onPress={() => router.push(`/projects/${project.id}`)}
                testID={`row-project-${project.id}`}
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
  chipRow: { marginTop: spacing.md },
  addCard: { marginTop: spacing.md },
  listCard: { marginTop: spacing.md },
});
