/**
 * Screen smoke tests — every redesigned screen renders with real sample data.
 * Catches broken style tokens, undefined references and layout crashes that
 * Metro's compiler cannot see.
 */
import { render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { DemoSessionProvider, useDemoSession } from '../../src/context/DemoSessionContext';
import ComplianceScreen from '../compliance';
import ModelsScreen from '../admin/models';
import ProjectUnitsScreen from '../projects/[projectId]';
import ProjectsScreen from '../projects';
import ServiceFormScreen from '../service/new';
import TechnicianDashboard from '../technician';
import UnitDetailsScreen from '../units/[unitId]';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Redirect: jest.fn(() => null),
  useLocalSearchParams: () => ({ projectId: 'prj-01', unitId: 'ACU-2025-0001' }),
}));

function signIn(role) {
  return function Harness({ children }) {
    const { signInAsAdmin, signInAsTechnician } = useDemoSession();
    React.useEffect(() => {
      if (role === 'admin') signInAsAdmin();
      else signInAsTechnician();
    }, [role, signInAsAdmin, signInAsTechnician]);
    return children;
  };
}

function renderAs(role, ui) {
  const Harness = signIn(role);
  return render(
    <DemoSessionProvider>
      <Harness>{ui}</Harness>
    </DemoSessionProvider>
  );
}

describe('Screen smoke tests (redesign)', () => {
  it('Projects screen renders ledger rows for a technician', async () => {
    await renderAs('technician', <ProjectsScreen />);
    await waitFor(() => expect(screen.getByText('Lahore Business Park — Block C')).toBeTruthy());
    // Technicians must NOT see inactive projects (proposal requirement).
    expect(screen.queryByText('Defence Shopping Mall — Rooftop Plant')).toBeNull();
  });

  it('AC Models screen renders model numbers in mono for an admin', async () => {
    await renderAs('admin', <ModelsScreen />);
    await waitFor(() => expect(screen.getByText('30XA-1202')).toBeTruthy());
    expect(screen.getByText('New model')).toBeTruthy();
  });

  it('Project Units screen lists units under the project', async () => {
    await renderAs('technician', <ProjectUnitsScreen />);
    await waitFor(() => expect(screen.getByText('ACU-2025-0001')).toBeTruthy());
    expect(screen.getByText('ACU-2025-0002')).toBeTruthy();
  });

  it('Unit Details screen renders the spec sheet and service history', async () => {
    await renderAs('technician', <UnitDetailsScreen />);
    await waitFor(() => expect(screen.getByText('Equipment record')).toBeTruthy());
    expect(screen.getByText('Serial number')).toBeTruthy();
    expect(screen.getByText('CAR-30XA-77120')).toBeTruthy();
    expect(screen.getByText('Service history')).toBeTruthy();
    expect(screen.getByText('2 entries')).toBeTruthy();
  });

  it('Service Form screen renders all three numbered sections', async () => {
    await renderAs('technician', <ServiceFormScreen />);
    await waitFor(() => expect(screen.getByText('Equipment')).toBeTruthy());
    expect(screen.getByText('Service type')).toBeTruthy();
    expect(screen.getByText('Work details')).toBeTruthy();
    expect(screen.getByText('Refrigerant Service')).toBeTruthy();
    expect(screen.getByTestId('btn-save-service')).toBeTruthy();
  });

  it('Technician Dashboard renders action, metrics and recent activity', async () => {
    await renderAs('technician', <TechnicianDashboard />);
    await waitFor(() => expect(screen.getByTestId('btn-new-service')).toBeTruthy());
    expect(screen.getByText('Recent activity')).toBeTruthy();
    expect(screen.getByText('Attention relevant to you')).toBeTruthy();
  });

  it('Compliance screen renders scope block and case files for the admin', async () => {
    await renderAs('admin', <ComplianceScreen />);
    await waitFor(() => expect(screen.getByText('Support scope')).toBeTruthy());
    expect(screen.getByTestId('case-att-001')).toBeTruthy();
    expect(screen.getByText('att-002')).toBeTruthy();
    expect(screen.getByTestId('btn-resolve-att-001')).toBeTruthy();
  });

  it('Compliance screen is read-only for the relevant technician', async () => {
    await renderAs('technician', <ComplianceScreen />);
    await waitFor(() => expect(screen.getByText('Support scope')).toBeTruthy());
    // Alex Rivera is relevant to att-002 only; no resolve buttons for technicians.
    expect(screen.getByTestId('case-att-002')).toBeTruthy();
    expect(screen.queryByTestId('btn-resolve-att-002')).toBeNull();
    expect(screen.getByText('Only administrators can resolve or close a case.')).toBeTruthy();
  });
});
