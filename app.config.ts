import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Challenge',
  slug: 'challenge',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'challenge',
  userInterfaceStyle: 'dark',
  ios: {
    bundleIdentifier: 'com.kiet.ngt.challenge',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#281942',
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#281942',
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
      },
    ],
    'expo-localization',
    [
      'expo-notifications',
      {
        // Duplicated from Colors.accent in src/constants/theme.ts — this file
        // runs in Node at build time and can't import theme.ts (it pulls in
        // react-native). Keep these two values in sync by hand.
        color: '#f77f00',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
