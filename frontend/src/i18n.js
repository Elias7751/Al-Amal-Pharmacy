import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import arTranslation from './locales/ar.json';
import enTranslation from './locales/en.json';

const resources = {
  ar: { translation: arTranslation },
  en: { translation: enTranslation }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // العربية كلغة افتراضية
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
