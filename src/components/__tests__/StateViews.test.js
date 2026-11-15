import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import EmptyState from '../EmptyState';
import ErrorState from '../ErrorState';
import LoadingState from '../LoadingState';
import StatusBadge from '../StatusBadge';

describe('LoadingState', () => {
  it('shows the loading message', async () => {
    await render(<LoadingState message="Loading projects…" />);
    expect(screen.getByText('Loading projects…')).toBeTruthy();
  });
});

describe('ErrorState', () => {
  it('explains the failure and offers retry', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState message="Network request failed." onRetry={onRetry} />);
    expect(screen.getByText('Network request failed.')).toBeTruthy();
    await fireEvent.press(screen.getByText('Retry'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('EmptyState', () => {
  it('explains that the list is empty', async () => {
    await render(<EmptyState title="No projects yet" message="Create your first project." />);
    expect(screen.getByText('No projects yet')).toBeTruthy();
    expect(screen.getByText('Create your first project.')).toBeTruthy();
  });

  it('offers the add action when provided', async () => {
    const onAction = jest.fn();
    await render(<EmptyState title="No projects yet" actionLabel="New Project" onAction={onAction} />);
    await fireEvent.press(screen.getByText('New Project'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe('StatusBadge', () => {
  it('renders the status label', async () => {
    await render(<StatusBadge label="Needs Admin Review" tone="warning" />);
    expect(screen.getByText('Needs Admin Review')).toBeTruthy();
  });

  it('renders the default neutral label', async () => {
    await render(<StatusBadge label="Inactive" />);
    expect(screen.getByText('Inactive')).toBeTruthy();
  });
});
