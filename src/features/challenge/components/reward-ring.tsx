import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';

const SIZE = 44;
const STROKE = 3;
const INNER_SIZE = SIZE - STROKE * 2 - 2;

interface RewardRingProps {
  days: number;
  fraction: number;
  unlocked: boolean;
}

export function RewardRing({ days, fraction, unlocked }: RewardRingProps) {
  const clampedFraction = Math.max(0, Math.min(1, fraction));

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View
          style={[
            styles.webTrack,
            { borderColor: unlocked ? Colors.success : Colors.surfacePressed },
          ]}
        />
      ) : (
        <SkiaRingCanvas fraction={clampedFraction} />
      )}
      <View
        style={[
          styles.inner,
          {
            width: INNER_SIZE,
            height: INNER_SIZE,
            borderRadius: INNER_SIZE / 2,
            backgroundColor: unlocked ? Colors.success : Colors.surface,
          },
        ]}
      >
        <ThemedText
          themeColor={unlocked ? 'onAccent' : 'text'}
          style={{ fontFamily: Fonts.displayExtraBold, fontSize: 13 }}
        >
          {days}
        </ThemedText>
      </View>
    </View>
  );
}

function SkiaRingCanvas({ fraction }: { fraction: number }) {
  const center = SIZE / 2;
  const radius = center - STROKE / 2;

  const progressPath = useMemo(() => {
    const path = Skia.Path.Make();
    const rect = Skia.XYWHRect(STROKE / 2, STROKE / 2, SIZE - STROKE, SIZE - STROKE);
    path.addArc(rect, -90, 360 * fraction);
    return path;
  }, [fraction]);

  return (
    <Canvas style={styles.canvas}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        style="stroke"
        strokeWidth={STROKE}
        color={Colors.surfacePressed}
      />
      {fraction > 0 ? (
        <Path
          path={progressPath}
          style="stroke"
          strokeWidth={STROKE}
          strokeCap="round"
          color={Colors.success}
        />
      ) : null}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
  },
  webTrack: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: STROKE,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
