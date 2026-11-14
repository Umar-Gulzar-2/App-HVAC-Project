/**
 * Records screen tests — company-wide list and search/filter behaviour.
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { DemoSessionProvider, useDemoSession } from '../../src/context/DemoSessionContext';
import RecordsScreen from '../admin/records';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Redirect: jest.fn(() => null),
  useLocalSearchParams: () => ({}),
}));

function AdminHarness() {
  const { signInAsAdmin } = useDemoSession();
  React.useEffect(() => {
    signInAsAdmin();
  }, [signInAsAdmin]);
  return <RecordsScreen />;
}

beforeEach(() => jest.clearAllMocks());

describe('Admin Records screen', () => {
  it('renders all sample service records for the administrator', async () => {
    await render(
      <DemoSessionProvider>
        <AdminHarness />
      </DemoSessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2026-10-22 · Refrigerant Service')).toBeTruthy();
    });
    expect(screen.getByText('2026-03-04 · Maintenance')).toBeTruthy();
    expect(screen.getByText('8 records across your company · 8 shown')).toBeTruthy();
  });

  it('filters records by search text (unit id / serial / work)', async () => {
    await render(
      <DemoSessionProvider>
        <AdminHarness />
      </DemoSessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2026-03-04 · Maintenance')).toBeTruthy();
    });

    await fireEvent.changeText(screen.getByTestId('search-records'), 'CAR-48TC-90066');

    await waitFor(() => {
      expect(screen.getByText('8 records across your company · 1 shown')).toBeTruthy();
    });
    expect(screen.queryByText('2026-03-04 · Maintenance')).toBeNull();
    expect(screen.getByText('2026-09-30 · Repair')).toBeTruthy();
  });

  it('shows the empty state when filters match nothing', async () => {
    await render(
      <DemoSessionProvider>
        <AdminHarness />
      </DemoSessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2026-03-04 · Maintenance')).toBeTruthy();
    });

    await fireEvent.changeText(screen.getByTestId('search-records'), 'no-such-equipment-zzz');

    await waitFor(() => {
      expect(screen.getByText('No records match these filters')).toBeTruthy();
    });
  });

  it('filters records by service type chip', async () => {
    await render(
      <DemoSessionProvider>
        <AdminHarness />
      </DemoSessionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('2026-03-04 · Maintenance')).toBeTruthy();
    });

    await fireEvent.press(screen.getByTestId('chip-Refrigerant Service'));

    await waitFor(() => {
      expect(screen.getByText('8 records across your company · 3 shown')).toBeTruthy();
    });
    expect(screen.queryByText('2026-03-04 · Maintenance')).toBeNull();
  });
});
