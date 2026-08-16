import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs
      backgroundColor={Colors.surface}
      indicatorColor={Colors.surfacePressed}
      tintColor={Colors.accent}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('tabs.home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home_filled' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="rewards">
        <NativeTabs.Trigger.Label>{t('tabs.rewards')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'trophy', selected: 'trophy.fill' }}
          md={{ default: 'trophy', selected: 'emoji_events' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
