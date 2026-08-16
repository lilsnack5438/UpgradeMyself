---
name: codebase-conventions
description: >-
  Reference for this repo's established architecture and style: design
  tokens in src/constants/theme.ts, ThemedText/ThemedView usage, the
  feature-folder layout (components/constants/state), the Context+useReducer
  state pattern, expo-router's Stack.Protected routing, react-i18next copy
  rules, and bun tooling. Load this BEFORE writing or editing any screen,
  component, state, or theme code in this repository, so new code matches
  the existing patterns instead of starting a parallel style. Also consult
  it before adding a new feature module, a new color/spacing/radius value,
  or any user-facing string.
---

# Codebase conventions

This app (package `tryhard`, product name "Kiên Trì") went through a full design-system build-out in one long session. The patterns below aren't arbitrary — each one closed a real gap or fixed a real bug found while building the app. Follow them so the codebase keeps reading as one system instead of drifting into several.

## Design tokens — `src/constants/theme.ts`

This file is the _only_ source of truth for color, type, spacing, and radius. Never inline a hex color, a raw `fontSize`, a spacing/margin/padding number, or a `borderRadius` number in a component — import the token instead.

```tsx
// ❌ don't
<View style={{ padding: 16, borderRadius: 14, backgroundColor: '#211914' }} />

// ✅ do
<ThemedView type="surface" style={{ padding: Spacing.lg, borderRadius: Radii.md }} />
```

- `Colors` is a **flat** map (not light/dark-keyed) — this app is dark-only by design intent, and no light variant should be invented.
- `Typography` holds named variants (`body`, `heading`, `label`, `button`, …), each a complete `{fontFamily, fontSize, lineHeight, ...}` object. A component picks a variant name, never a raw number.
- `Spacing` and `Radii` are named numeric scales, not ad-hoc values.
- Every numeric token is wrapped in `moderateScale()` (also exported from `theme.ts`) except `Radii.full` (999 — a pill/circle escape hatch that doesn't need scaling). If a component needs a genuinely new size, add it to the right scale in `theme.ts` — wrapped in `moderateScale()` if it's spacing/radius/font size — rather than hardcoding it at the call site. `moderateScale`/`scale`/`verticalScale` are there to reuse directly if a component has a one-off dimension that doesn't belong in a shared token.

## Themed primitives — `ThemedText` / `ThemedView`

Reach for these instead of raw RN `Text`/`View` whenever color is involved:

```tsx
<ThemedText type="bodyStrong" themeColor="accent">Chỉnh sửa</ThemedText>
<ThemedView type="surfacePressed" style={styles.card}>...</ThemedView>
```

`ThemedText`'s `type` is a `Typography` key (defaults to `body`); its `themeColor` is a `Colors` key (defaults to `text`). `ThemedView`'s `type` is a `Colors` key that sets the background (defaults to `background`).

## Feature folders — `src/features/<feature>/`

Each feature (e.g. `challenge/`) gets three subfolders:

```
src/features/challenge/
  components/   one component per file, kebab-case filename, PascalCase export
  constants/    structural data only — ids, numeric ranges, a Colors key for accent
  state/        types.ts, reducer.ts, persistence.ts, <feature>-provider.tsx
```

`constants/` holds **structure, not copy** — no user-facing strings. A constants file with a `name`/`title`/`desc` field is a sign copy leaked out of i18n; the id should look up its text from `vi.json` at render time instead.

`src/app/` is expo-router route files only. Keep them thin — a route file imports and renders a feature screen/component; it shouldn't contain real layout or business logic itself. If a route file is growing past "wire up props and navigate," that logic belongs in `features/<feature>/`.

## State — Context + `useReducer`

The `state/` folder is a fixed four-file shape:

- `types.ts` — the state shape and the reducer's `Action` union
- `reducer.ts` — `initialState` + a pure reducer (no side effects)
- `persistence.ts` — `loadState()`/`saveState()` wrapping AsyncStorage behind a versioned key (`@<feature>/state/v1`); bump the version if the shape ever changes incompatibly rather than writing migration code
- `<feature>-provider.tsx` — a `<Feature>Provider` component plus a `use<Feature>()` hook that throws if called outside the provider

There's no state library in this repo (no Redux/Zustand/Jotai) — Context+`useReducer` has been enough so far. Reach for the same pattern for a new feature rather than introducing a new state-management approach; if a feature genuinely outgrows it, that's a conversation to have explicitly, not a silent per-feature choice.

## Routing — expo-router

For conditional flows (onboarding vs. main app is the existing example), gate with `Stack.Protected` in the root `_layout.tsx`:

```tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Protected guard={!state.hasOnboarded}>
    <Stack.Screen name="onboarding/select" />
  </Stack.Protected>
  <Stack.Protected guard={state.hasOnboarded}>
    <Stack.Screen name="(tabs)" />
  </Stack.Protected>
</Stack>
```

Prefer this over scattering manual `<Redirect>` checks across screens. When a dispatch flips the guard's condition (e.g. finishing onboarding), follow it with an explicit `router.replace(...)`/`router.push(...)` in the same handler — don't rely on the guard re-render alone to move the user off a screen that's about to become inaccessible.

Any layout using `expo-router/unstable-native-tabs` (native-only) needs a `_layout.web.tsx` sibling built on `expo-router/ui`'s `Tabs`/`TabList`/`TabTrigger` — the native API has no web implementation.

## i18n — react-i18next

All user-facing copy lives in `src/i18n/locales/vi.json`, namespaced by screen or domain (`select.title`, `home.greeting`, …). Pull it in with `useTranslation()` + `t('namespace.key')` — never hardcode a string directly in JSX.

When a key has to be built from a data id — `t(\`exercises.${id}.name\`)` — the id's TypeScript type must be a literal union (`'pushup' | 'jumprope' | 'english'`), not a generic `string`. The strict i18next typing (`src/types/i18next.d.ts`) checks the interpolated template literal against real keys in `vi.json`; a widened type defeats that check and TypeScript will reject the call. This is also just a correctness improvement in its own right — a closed set of ids should always be a literal union, never a plain string.

Only register locales that actually have authored content in `src/i18n/index.ts` — don't invent an `en` translation nobody asked for. Keep the `resources` map shaped so adding one later is a one-line change.

## Tooling

Package manager is **bun** — `bun add`, `bun install`, `bun run <script>`, never `npm`/`yarn`. Before treating any change as finished, run:

```bash
bun run typecheck && bun run lint && bun run format
```

All three should be clean. `bun run format:check` is the non-mutating variant for CI-style checks.

`@shopify/react-native-skia` works on native but has no CanvasKit/wasm loading configured for web — a component that uses it will crash the web build outright if rendered unconditionally. Branch on `Platform.OS === 'web'` and render a plain-View fallback there (see `src/features/challenge/components/reward-ring.tsx` for the pattern already in place).

## Verify against the running app

Before calling a UI change done, actually look at it — iOS Simulator screenshot, or the web build in a browser. Typecheck and lint catch a lot, but they don't catch a wrong layout, a missing platform branch, or a color that doesn't read the way it does in the design.
