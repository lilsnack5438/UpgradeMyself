import { StyleSheet, View } from 'react-native';

import { Colors, Radii, type ThemeColor } from '@/constants/theme';

interface ProgressBarProps {
  progress: number;
  goal: number;
  color: ThemeColor;
}

export function ProgressBar({ progress, goal, color }: ProgressBarProps) {
  const pct = goal > 0 ? Math.round(Math.min(100, (progress / goal) * 100)) : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: Colors[color] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: Radii.xs,
    backgroundColor: Colors.surfacePressed,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radii.xs,
  },
});
