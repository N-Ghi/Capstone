import translation from '../i18n/locales/en/translation.json';
import auth from '../i18n/locales/en/auth.json';
import dashboards from '../i18n/locales/en/dashboards.json';
import experience from '../i18n/locales/en/experience.json';
import profile from '../i18n/locales/en/profile.json';
import common from '../i18n/locales/en/common.json';
import booking from '../i18n/locales/en/booking.json';
import payment from '../i18n/locales/en/payment.json';
import review from '../i18n/locales/en/review.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
      auth:        typeof auth;
      dashboards:   typeof dashboards;
      experience:   typeof experience;
      profile:      typeof profile;
      common:       typeof common;
      booking:      typeof booking;
      payment:      typeof payment;
      review:       typeof review;
    };
  }
}