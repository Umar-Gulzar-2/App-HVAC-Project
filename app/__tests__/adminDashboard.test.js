/**
 * Admin Dashboard tests — role guard and proposal-required counts.
 */
import { render, screen, waitFor, within } from '@testing-library/react-native';
import React from 'react';
import { DemoSessionProvider, useDemoSession } from '../../src/context/DemoSessionContext';
import AdminDashboard from '../admin';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Redirect: jest.fn(() => null),
  useLocalSearchParams: () => ({}),
}));

const { Redirect } = require('expo-router');

/** Signs in as admin on mount so the guarded screen renders its content. */
function AdminHarness() {
  const { signInAsAdmin } = useDemoSession();
  React.useEffect(() => {
    signInAsAdmin();
  }, [signInAsAdmin]);
  return <AdminDashboard />;
}

beforeEach(() => jest.clearAllMocks());

describe('Admin Dashboard', () => {
  it('redirects visitors with no session to the login screen', async () => {
    await render(
      <DemoSessionProvider>
        <AdminDashboard />
      </DemoSessionProvider>
    );
    const redirectProps = Redirect.mock.calls.map((call) => call[0]);
    expect(redirectProps.some((props) => props?.href === '/login')).toBe(true);
  });

  it('shows the proposal-required summary counts when signed in as admin', async () => {
    await render(
      <DemoSessionProvider>
        <AdminHarness />
      </DemoSessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Active projects')).toBeTruthy();
    });
    // "Technicians" appears in both the stat tile and the management list.
    expect(screen.getByTestId('stat-Technicians')).toBeTruthy();
    expect(screen.getByText('AC units')).toBeTruthy();
    expect(screen.getByText('Service records')).toBeTruthy();
    expect(screen.getByText('Open attention')).toBeTruthy();

    // Sample data counts: 3 active projects, 5 units, 8 service records,
    // 2 open attention cases. Scoped queries avoid ambiguity between tiles.
    expect(within(screen.getByTestId('stat-Active projects')).getByText('3')).toBeTruthy();
    expect(within(screen.getByTestId('stat-AC units')).getByText('5')).toBeTruthy();
    expect(within(screen.getByTestId('stat-Service records')).getByText('8')).toBeTruthy();
    expect(within(screen.getByTestId('stat-Open attention')).getByText('2')).toBeTruthy();
  });

  it('lists the management shortcuts from the proposal', async () => {
    await render(
      <DemoSessionProvider>
        <AdminHarness />
      </DemoSessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Projects')).toBeTruthy();
    });
    expect(screen.getByText('AC Models')).toBeTruthy();
    expect(screen.getByText('Service Records')).toBeTruthy();
    expect(screen.getByText('Compliance Attention')).toBeTruthy();
    expect(screen.getAllByText('Technicians').length).toBeGreaterThan(0);
  });
});
