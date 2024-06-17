import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from '../../public/locales/en/translation.json';
const resources = {
    en: {
        translation: translationEN
    }
};

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        keySeparator: false,

        interpolation: {
            escapeValue: false
        }

    });


export default i18n;