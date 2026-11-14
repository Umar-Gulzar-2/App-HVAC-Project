/**
 * Root layout — providers and the top-level navigation stack.
 * Every screen renders without the native header; screens draw their own
 * navy AppHeader so styling stays consistent.
 */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoSessionProvider } from '../src/context/DemoSessionContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoSessionProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      </DemoSessionProvider>
    </SafeAreaProvider>
  );
}
