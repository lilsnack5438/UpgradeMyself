# TryHard

A React Native app built with [Expo](https://expo.dev) SDK 57, [expo-router](https://docs.expo.dev/router/introduction/), and TypeScript.

## Stack

- **Expo SDK 57** + **expo-router** (file-based routing, typed routes)
- **react-native-reanimated** + **react-native-worklets** for animations
- **@shopify/react-native-skia** for high-performance 2D graphics
- **@tanstack/react-query** for server-state/data fetching
- **@supabase/supabase-js** for auth, database, and storage
- **ESLint** + **Prettier** for linting/formatting

## Get started

1. Install dependencies ([bun](https://bun.sh) is this project's package manager)

   ```bash
   bun install
   ```

2. Configure environment variables

   ```bash
   cp .env.example .env
   ```

   Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

3. Start the app

   ```bash
   bun start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project structure

```
src/
  app/          # expo-router routes (screens, layouts)
  components/   # shared UI components
  constants/    # design tokens (colors, spacing, fonts)
  hooks/        # shared hooks
  lib/          # library clients (Supabase, TanStack Query) and framework glue
```

## Scripts

- `bun start` – start the Metro dev server
- `bun run ios` / `bun run android` / `bun run web` – start and open on a platform
- `bun run lint` – run ESLint
- `bun run format` – format the project with Prettier
- `bun run typecheck` – run the TypeScript compiler in check-only mode
- `bun run reset-project` – move the starter code to **app-example** and create a blank **src/app**

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [TanStack Query documentation](https://tanstack.com/query/latest)
- [Supabase documentation](https://supabase.com/docs)
- [React Native Skia documentation](https://shopify.github.io/react-native-skia/)
- [React Native Reanimated documentation](https://docs.swmansion.com/react-native-reanimated/)
