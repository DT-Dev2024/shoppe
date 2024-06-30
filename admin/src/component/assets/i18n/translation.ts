import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import XHR from 'i18next-xhr-backend'

import translationEn from './en/translation.json'
import translationVi from './vi/translation.json'

i18n
  .use(LanguageDetector)
  .use(XHR)
  .init({
    debug: false,
    lng: 'vi',
    fallbackLng: 'vi',

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: {
        translations: translationEn,
      },
      vi: {
        translations: translationVi,
      },
    },
    ns: ['translations'],
    defaultNS: 'translations',
  })

export default i18n
