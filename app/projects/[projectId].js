/**
 * Project Units screen — installed AC units registered under one project.
 * Unit ID leads each row in mono; serial and charge details follow.
 * Technicians get a sticky "Register unit" action (form arrives in Chunk 5).
 * Equipment is shared: every active technician can find any unit.
 */
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import ActionBar from '../../src/components/ActionBar';
import AppHeader from '../../src/components/AppHeader';
import EmptyState from '../../src/components/EmptyState';
import ListRow from '../../src/components/ListRow';
import ScreenContainer from '../../src/components/ScreenContainer';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModelsById, projects, units } from '../../src/data/sampleData';
import { colors, radius, spacing } from '../../src/theme/theme';

export default function ProjectUnitsScreen() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();
  const { role } = useDemoSession();

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projectId]);
  const projectUnits = useMemo(() => units.filter((u) => u.projectId === projectId), [projectId]);

  if (!role) return <Redirect href="/login" />;

  // Technicians only browse active projects; admins see everything.
  if (!project || (role === 'technician' && project.status !== 'active')) {
    return <Redirect href="/projects" />;
  }

  const isTechnician = role === 'technician';

  const registerComingSoon = () =>
    Alert.alert('Register unit', 'The unit registration form (serial, install date, refrigerant, charge) connects in Milestone 5.');

  return (
    <View style={styles.page}>
      <AppHeader
        variant="page"
        title={project.name}
        subtitle={`${project.client} · ${project.siteAddress}`}
        meta={`${projectUnits.length} units · ${project.status === 'active' ? 'active project' : 'inactive project'}`}
        right={<SignOutButton />}
      />
      <ScreenContainer style={isTechnician ? undefined : undefined}>
        <View style={styles.ledger}>
          {projectUnits.length === 0 ? (
            <EmptyState
              title="No units registered yet"
              message={
                isTechnician
                  ? 'Register the physical AC units installed at this site so service history can be recorded against them.'
                  : 'Units appear here once a technician registers installed equipment for this project.'
              }
              actionLabel={isTechnician ? 'Register unit' : undefined}
              onAction={isTechnician ? registerComingSoon : undefined}
              testID="empty-units"
            />
          ) : (
            projectUnits.map((unit, index) => {
              const model = acModelsById[unit.modelId];
              return (
                <ListRow
                  key={unit.id}
                  first={index === 0}
                  title={unit.id}
                  monoTitle
                  meta={`Serial ${unit.serialNumber}`}
                  metaMono
                  meta2={`${model?.manufacturer ?? ''} ${model?.modelNumber ?? ''} · ${unit.refrigerantType} · ${unit.fullChargeLbs} lbs`}
                  badge={<StatusBadge label="Active" tone="success" />}
                  onPress={() => router.push(`/units/${unit.id}`)}
                  testID={`row-unit-${unit.id}`}
                />
              );
            })
          )}
        </View>
        {isTechnician ? <View style={styles.spacer} /> : null}
      </ScreenContainer>
      {isTechnician ? (
        <ActionBar label="Register unit" onPress={registerComingSoon} testID="btn-register-unit" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  ledger: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  spacer: { height: spacing.lg },
});
