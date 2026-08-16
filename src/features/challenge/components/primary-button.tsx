import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radii, Spacing, type ThemeColor } from '@/constants/theme';

interface PrimaryButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  color?: ThemeColor;
}

export function PrimaryButton({ label, color = 'accent', disabled, ...rest }: PrimaryButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.button, { backgroundColor: Colors[color] }, disabled ? styles.disabled : null]}
      {...rest}
    >
      <ThemedText type="button" themeColor="onAccent" style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radii.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    textAlign: 'center',
  },
});
