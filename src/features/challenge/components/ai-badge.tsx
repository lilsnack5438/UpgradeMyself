import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radii } from '@/constants/theme';

export function AiBadge() {
  return (
    <View style={styles.badge}>
      <ThemedText type="captionSmall" themeColor="accentPurple" style={styles.label}>
        AI
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: Radii.xs,
    backgroundColor: Colors.accentPurpleSoft,
  },
  label: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
