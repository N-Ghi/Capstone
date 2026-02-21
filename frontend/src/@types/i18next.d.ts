import en from '../i18n/locales/en/translation.json';
import auth from '../i18n/locales/en/auth.json';


declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
      auth:        typeof auth;
    };
  }
}