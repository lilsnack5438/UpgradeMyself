import { Platform } from 'react-native';

/**
 * Kiên Trì is a fixed dark-only design — no light variant was ever specified,
 * so none is invented here. Values converted from the source design's OKLCH
 * palette through the real OKLab → linear-sRGB → sRGB pipeline.
 */
export const Colors = {
  background: '#140e0a',
  surface: '#211914',
  surfacePressed: '#2e241d',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.15)',
  text: '#f7f5f2',
  textSecondary: '#a8a49e',
  textMuted: '#6c6863',
  accent: '#f77f00',
  accentCyan: '#00c3d1',
  accentPurple: '#b786ff',
  success: '#4cc157',
  successSoft: 'rgba(76,193,87,0.14)',
  danger: '#e85854',
  onAccent: '#140e0a',
} as const;

export type ThemeColor = keyof typeof Colors;

export const Fonts = {
  displayExtraBold: 'Manrope_800ExtraBold',
  displayBold: 'Manrope_700Bold',
  body: Platform.select({ ios: 'system-ui', android: 'sans-serif', default: 'system-ui' }),
  mono: Platform.select({ ios: 'ui-monospace', android: 'monospace', default: 'monospace' }),
} as const;

export const Spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  smd: 10,
  md: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radii = {
  xs: 4,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

export const Typography = {
  eyebrow: {
    fontFamily: Fonts.displayBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    fontFamily: Fonts.displayBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  display: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: 27,
    lineHeight: 34,
  },
  heading: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: 24,
    lineHeight: 30,
  },
  statLarge: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: 26,
    lineHeight: 30,
  },
  body: {
    fontFamily: Fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  caption: {
    fontFamily: Fonts.body,
    fontSize: 12.5,
    lineHeight: 18,
  },
  captionSmall: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '700',
  },
  button: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: 15,
    lineHeight: 20,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 480;
