import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const { PUBLIC_URL: publicUrl } = process.env;

i18n
  .use(detector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    whitelist: ['en', 'sv', 'de'],
    supportedLngs: ['en', 'sv', 'de'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    nsSeparator: false,
    keySeparator: false,
    backend: {
      loadPath: `${publicUrl}/locales/{{lng}}/{{ns}}.json`,
    },
  });

export default i18n;
