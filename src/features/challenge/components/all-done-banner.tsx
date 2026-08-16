import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { PrimaryButton } from './primary-button';

export function AllDoneBanner({ onEndDay }: { onEndDay: () => void }) {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.banner}>
      <ThemedText type="label" style={styles.title}>
        {t('home.allDoneTitle')}
      </ThemedText>
      <PrimaryButton color="success" label={t('home.endDay')} onPress={onEndDay} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.success,
    backgroundColor: Colors.successSoft,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.smd,
  },
});
