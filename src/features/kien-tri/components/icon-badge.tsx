import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, type ThemeColor } from '@/constants/theme';

const SIZES = {
  sm: { box: 34, radius: 10, font: 11 },
  md: { box: 36, radius: 11, font: 12 },
  lg: { box: 44, radius: 13, font: 14 },
} as const;

interface IconBadgeProps {
  label: string;
  color: ThemeColor;
  size?: keyof typeof SIZES;
}

export function IconBadge({ label, color, size = 'lg' }: IconBadgeProps) {
  const { box, radius, font } = SIZES[size];

  return (
    <View
      style={[
        styles.badge,
        { width: box, height: box, borderRadius: radius, backgroundColor: Colors[color] },
      ]}
    >
      <ThemedText
        themeColor="onAccent"
        style={{ fontFamily: Fonts.displayExtraBold, fontSize: font }}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
