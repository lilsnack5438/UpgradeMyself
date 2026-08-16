import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, type TypographyVariant } from '@/constants/theme';

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  titleType?: Extract<TypographyVariant, 'display' | 'heading'>;
  subtitle?: string;
}

export function ScreenHeader({
  eyebrow,
  title,
  titleType = 'display',
  subtitle,
}: ScreenHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      {eyebrow ? (
        <ThemedText type="eyebrow" themeColor="accent">
          {eyebrow}
        </ThemedText>
      ) : null}
      <ThemedText type={titleType} style={styles.title}>
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText type="body" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  title: {
    marginBottom: Spacing.xxs,
  },
});
