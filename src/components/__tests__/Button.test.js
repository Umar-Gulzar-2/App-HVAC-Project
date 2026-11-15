import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Button from '../Button';

describe('Button', () => {
  it('renders its label', async () => {
    await render(<Button label="Save record" onPress={() => {}} />);
    expect(screen.getByText('Save record')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button label="Retry" onPress={onPress} />);
    await fireEvent.press(screen.getByTestId('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save record" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByTestId('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress while loading', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save record" onPress={onPress} loading />);
    await fireEvent.press(screen.getByTestId('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
