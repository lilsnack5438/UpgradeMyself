import { ThemedText } from '@/components/themed-text';

export function SectionLabel({ children }: { children: string }) {
  return (
    <ThemedText type="sectionLabel" themeColor="textMuted">
      {children}
    </ThemedText>
  );
}
