/**
 * Login / Signup screen tests.
 * expo-router is mocked so navigation can be asserted without a router.
 */
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { DemoSessionProvider } from '../../src/context/DemoSessionContext';
import LoginScreen from '../login';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Redirect: jest.fn(() => null),
  useLocalSearchParams: () => ({}),
}));

const { useRouter } = require('expo-router');

function renderLogin() {
  return render(
    <DemoSessionProvider>
      <LoginScreen />
    </DemoSessionProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  useRouter.mockReturnValue({ push: jest.fn(), replace: jest.fn(), back: jest.fn() });
});

describe('Login screen', () => {
  it('shows the sign-in form and the clearly-labelled preview buttons', async () => {
    await renderLogin();
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
    expect(screen.getByTestId('submit-auth')).toBeTruthy();
    expect(screen.getByPlaceholderText('name@company.com')).toBeTruthy();
    expect(screen.getByText('Preview this build')).toBeTruthy();
    expect(screen.getByText('Administrator view')).toBeTruthy();
    expect(screen.getByText('Technician view')).toBeTruthy();
  });

  it('shows validation errors when submitting an empty form', async () => {
    await renderLogin();
    await fireEvent.press(screen.getByTestId('submit-auth'));
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
    expect(screen.getByText('Password must be at least 6 characters.')).toBeTruthy();
  });

  it('switches to Create Account mode with company fields', async () => {
    await renderLogin();
    await fireEvent.press(screen.getByText('Create Account'));
    expect(screen.getByText('Company name')).toBeTruthy();
    expect(screen.getByText('Your name')).toBeTruthy();
    expect(screen.getByText('Create Company Account')).toBeTruthy();
  });

  it('validates required fields on account creation', async () => {
    await renderLogin();
    await fireEvent.press(screen.getByText('Create Account'));
    await fireEvent.press(screen.getByTestId('submit-auth'));
    expect(screen.getByText('Enter your company name.')).toBeTruthy();
    expect(screen.getByText('Enter your name.')).toBeTruthy();
  });

  it('navigates to the admin dashboard from the preview button', async () => {
    const replace = jest.fn();
    useRouter.mockReturnValue({ push: jest.fn(), replace, back: jest.fn() });
    await renderLogin();
    await fireEvent.press(screen.getByText('Administrator view'));
    expect(replace).toHaveBeenCalledWith('/admin');
  });

  it('navigates to the technician dashboard from the preview button', async () => {
    const replace = jest.fn();
    useRouter.mockReturnValue({ push: jest.fn(), replace, back: jest.fn() });
    await renderLogin();
    await fireEvent.press(screen.getByText('Technician view'));
    expect(replace).toHaveBeenCalledWith('/technician');
  });
});
