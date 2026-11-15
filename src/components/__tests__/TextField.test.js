import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import TextField from '../TextField';

describe('TextField', () => {
  it('renders its label and placeholder', async () => {
    await render(<TextField label="Email" placeholder="name@company.com" value="" onChangeText={() => {}} />);
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('name@company.com')).toBeTruthy();
  });

  it('shows an inline validation error when provided', async () => {
    await render(<TextField label="Email" value="bad" onChangeText={() => {}} error="Enter a valid email address." />);
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
  });

  it('does not show an error when none is provided', async () => {
    await render(<TextField label="Email" value="a@b.com" onChangeText={() => {}} />);
    expect(screen.queryByText('Enter a valid email address.')).toBeNull();
  });

  it('hides password text and allows revealing it', async () => {
    await render(<TextField label="Password" value="secret123" onChangeText={() => {}} secureTextEntry />);
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByText('Show'));
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
  });

  it('reports typed text through onChangeText', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Email" value="" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText('Email'), 'tech@company.com');
    expect(onChangeText).toHaveBeenCalledWith('tech@company.com');
  });
});
