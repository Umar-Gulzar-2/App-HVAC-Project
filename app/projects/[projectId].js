/**
 * Project Units screen — installed AC units registered under one project.
 * Technicians register new units here (form itself arrives in Chunk 5).
 * Equipment records are shared: every active technician of the company can
 * find and open any unit — records do not belong to the creating technician.
 */
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import AppHeader from '../../src/components/AppHeader';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import EmptyState from '../../src/components/EmptyState';
import ListRow from '../../src/components/ListRow';
import ScreenContainer from '../../src/components/ScreenContainer';
import SignOutButton from '../../src/components/SignOutButton';
import StatusBadge from '../../src/components/StatusBadge';
import { useDemoSession } from '../../src/context/DemoSessionContext';
import { acModelsById, projects, units } from '../../src/data/sampleData';
import { colors, spacing } from '../../src/theme/theme';

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
        badgeLabel={project.status === 'active' ? 'ACTIVE PROJECT' : 'INACTIVE PROJECT'}
        right={<SignOutButton />}
      />
      <ScreenContainer>
        {isTechnician ? (
          <Button label="Register AC Unit" size="lg" onPress={registerComingSoon} style={styles.registerButton} testID="btn-register-unit" />
        ) : null}

        {projectUnits.length === 0 ? (
          <Card style={styles.listCard}>
            <EmptyState
              title="No units registered yet"
              message={
                isTechnician
                  ? 'Register the physical AC units installed at this site so service history can be recorded against them.'
                  : 'Units appear here once a technician registers installed equipment for this project.'
              }
              actionLabel={isTechnician ? 'Register AC Unit' : undefined}
              onAction={isTechnician ? registerComingSoon : undefined}
              testID="empty-units"
            />
          </Card>
        ) : (
          <Card padded={false} style={styles.listCard}>
            {projectUnits.map((unit, index) => {
              const model = acModelsById[unit.modelId];
              return (
                <ListRow
                  key={unit.id}
                  first={index === 0}
                  title={unit.id}
                  meta={`${model?.manufacturer ?? ''} ${model?.modelNumber ?? ''} · Serial ${unit.serialNumber}`}
                  meta2={`${unit.refrigerantType} · ${unit.fullChargeLbs} lbs full charge · Installed ${unit.installationDate}`}
                  badge={<StatusBadge label="Active" tone="success" />}
                  onPress={() => router.push(`/units/${unit.id}`)}
                  testID={`row-unit-${unit.id}`}
                />
              );
            })}
          </Card>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surfaceAlt },
  registerButton: { marginTop: spacing.lg },
  listCard: { marginTop: spacing.lg },
});
