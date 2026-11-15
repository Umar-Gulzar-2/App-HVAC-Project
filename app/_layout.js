/**
 * Root layout — fonts, splash, providers, and the top-level stack.
 *
 * IBM Plex Sans (language) and IBM Plex Mono (identifiers, dates, figures)
 * are loaded before first paint so type never falls back to the system font.
 * If a font fails to download, the app still opens with system fonts rather
 * than hanging on the splash screen.
 */
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoSessionProvider } from '../src/context/DemoSessionContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
  });

  const ready = fontsLoaded || fontError != null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // Keep the native splash only while fonts are loading.
  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <DemoSessionProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      </DemoSessionProvider>
    </SafeAreaProvider>
  );
}
