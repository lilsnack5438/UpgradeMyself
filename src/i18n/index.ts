import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import vi from './locales/vi.json';

const resources = {
  vi: { translation: vi },
} as const;

const deviceLanguage = getLocales()[0]?.languageCode;
const initialLanguage = deviceLanguage && deviceLanguage in resources ? deviceLanguage : 'vi';

// eslint-disable-next-line import/no-named-as-default-member -- standard i18next plugin-chaining API
i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

export default i18n;
