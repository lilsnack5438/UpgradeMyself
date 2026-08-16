import '@/i18n';

import { Manrope_700Bold, Manrope_800ExtraBold, useFonts } from '@expo-google-fonts/manrope';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors } from '@/constants/theme';
import { KienTriProvider, useKienTri } from '@/features/kien-tri/state/kien-tri-provider';
import { queryClient } from '@/lib/query-client';

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.accent,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.danger,
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Manrope_700Bold, Manrope_800ExtraBold });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KienTriProvider>
          <ThemeProvider value={navigationTheme}>
            <AppReady />
          </ThemeProvider>
        </KienTriProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function AppReady() {
  const { state, isHydrated } = useKienTri();

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!state.hasOnboarded}>
        <Stack.Screen name="onboarding/select" />
        <Stack.Screen name="onboarding/goals" />
      </Stack.Protected>
      <Stack.Protected guard={state.hasOnboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="edit-goals" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}
