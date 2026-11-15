/**
 * Root layout — fonts, splash, providers, and the top-level stack.
 *
 * IBM Plex Sans (language) and IBM Plex Mono (identifiers, dates, figures)
 * are loaded before first paint so type never falls back to the system font.
 *
 * Two loading paths:
 *  - Native (Expo Go): expo-font `useFonts` reads the bundled font files.
 *  - Web: fonts are fetched explicitly into memory and registered with the
 *    FontFace API. The default CSS-lazy path silently keeps rendering the
 *    browser's fallback (often Times serif) when the font request fails or
 *    is slow — this loader fetches eagerly through the same request path as
 *    the rest of the app, verifies each font, and only then opens the UI.
 *    If loading still fails (or times out), the theme's fallback stacks
 *    render a clean system sans/mono instead of Times.
 */
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium, IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono';
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium, IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans';
import { Asset } from 'expo-asset';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoSessionProvider } from '../src/context/DemoSessionContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

const FONT_SOURCES = {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
};

/** Never block the preview longer than this if the network misbehaves. */
const FONT_LOAD_TIMEOUT_MS = 8000;

/**
 * Web: fetch each font as bytes (same request pipeline as the rest of the
 * app, so any preview/proxy auth applies), then register it with FontFace.
 */
async function loadWebFonts() {
  if (typeof document === 'undefined' || typeof FontFace === 'undefined') return;

  await Promise.all(
    Object.entries(FONT_SOURCES).map(async ([name, source]) => {
      const uri = Asset.fromModule(source).uri;
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Font ${name} failed: HTTP ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      const face = new FontFace(name, buffer);
      await face.load();
      document.fonts.add(face);
    })
  );
}

function AppShell({ ready }) {
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  // Keep the splash only while fonts are loading.
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

/** Native path — expo-font reads bundled font files directly. */
function NativeFontGate() {
  const [fontsLoaded, fontError] = useFonts(FONT_SOURCES);
  return <AppShell ready={fontsLoaded || fontError != null} />;
}

/** Web path — eager fetch + FontFace registration with a hard timeout. */
function WebFontGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timeout = new Promise((resolve) => setTimeout(resolve, FONT_LOAD_TIMEOUT_MS));

    Promise.race([loadWebFonts(), timeout])
      .catch(() => {
        // Font failure must never block the app: the theme's fallback
        // stacks keep type as a clean system sans/mono, never Times.
      })
      .finally(() => {
        if (mounted) setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return <AppShell ready={ready} />;
}

export default function RootLayout() {
  return Platform.OS === 'web' ? <WebFontGate /> : <NativeFontGate />;
}
