import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';

import type { HistoryEntry } from '../state/types';

const VISIBLE_COUNT = 10;

function dotStyle(entry: HistoryEntry | null) {
  if (!entry) return { backgroundColor: 'transparent', borderColor: Colors.borderStrong };
  if (entry.status === 'done')
    return { backgroundColor: Colors.success, borderColor: 'transparent' };
  if (entry.status === 'missed')
    return { backgroundColor: Colors.accent, borderColor: 'transparent' };
  return { backgroundColor: Colors.danger, borderColor: 'transparent' };
}

export function HistoryDots({ history }: { history: HistoryEntry[] }) {
  const visible: (HistoryEntry | null)[] = Array.from({ length: VISIBLE_COUNT }, (_, i) => {
    const idx = history.length - VISIBLE_COUNT + i;
    return idx >= 0 ? history[idx] : null;
  });

  return (
    <View style={styles.row}>
      {visible.map((entry, i) => (
        <View key={i} style={[styles.dot, dotStyle(entry)]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
  },
});
