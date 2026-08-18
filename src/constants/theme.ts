import { Dimensions, PixelRatio, Platform } from 'react-native';

/**
 * Challenge is a fixed dark-only design — no light variant was ever specified,
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
  accentSoft: 'rgba(247,127,0,0.16)',
  accentCyan: '#00c3d1',
  accentPurple: '#b786ff',
  accentPurpleSoft: 'rgba(183,134,255,0.18)',
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

/**
 * Responsive scaling (react-native-size-matters approach), measured once
 * against the design reference device (iPhone 14/15-class, 390×844 pt).
 * Static by design — matches the underlying library's own behavior and
 * avoids turning every token into a hook just to react to app.json's
 * portrait-locked orientation, which never changes post-launch anyway.
 */
const REFERENCE_WIDTH = 390;
const REFERENCE_HEIGHT = 844;

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const [shortDimension, longDimension] =
  windowWidth < windowHeight ? [windowWidth, windowHeight] : [windowHeight, windowWidth];

export function scale(size: number): number {
  return (shortDimension / REFERENCE_WIDTH) * size;
}

export function verticalScale(size: number): number {
  return (longDimension / REFERENCE_HEIGHT) * size;
}

/**
 * Scales `size` toward its device-scaled value by `factor` (0 = no scaling,
 * 1 = full scale). Default 0.5 keeps spacing/type from swinging as wildly
 * as raw `scale()` would between a compact phone and a large tablet.
 */
export function moderateScale(size: number, factor = 0.5): number {
  return PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);
}

export const Spacing = {
  xxs: moderateScale(4),
  xs: moderateScale(6),
  sm: moderateScale(8),
  smd: moderateScale(10),
  md: moderateScale(12),
  base: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
} as const;

export const Radii = {
  xs: moderateScale(4),
  sm: moderateScale(10),
  md: moderateScale(14),
  lg: moderateScale(18),
  xl: moderateScale(24),
  // Intentionally unscaled — a pill/circle radius just needs to exceed half
  // the element's largest dimension, scaling it further changes nothing.
  full: 999,
} as const;

export const Typography = {
  eyebrow: {
    fontFamily: Fonts.displayBold,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  sectionLabel: {
    fontFamily: Fonts.displayBold,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  display: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: moderateScale(27),
    lineHeight: moderateScale(34),
  },
  heading: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: moderateScale(24),
    lineHeight: moderateScale(30),
  },
  statLarge: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: moderateScale(26),
    lineHeight: moderateScale(30),
  },
  body: {
    fontFamily: Fonts.body,
    fontSize: moderateScale(14.5),
    lineHeight: moderateScale(22),
  },
  bodyStrong: {
    fontFamily: Fonts.body,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  },
  caption: {
    fontFamily: Fonts.body,
    fontSize: moderateScale(12.5),
    lineHeight: moderateScale(18),
  },
  captionSmall: {
    fontFamily: Fonts.body,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: moderateScale(13.5),
    lineHeight: moderateScale(18),
    fontWeight: '700',
  },
  button: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: moderateScale(15),
    lineHeight: moderateScale(20),
  },
} as const;

export type TypographyVariant = keyof typeof Typography;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 480;
