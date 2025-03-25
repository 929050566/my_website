import personalCatalogTranslations from './translations/personalCatalog';
import blogTranslations from './translations/blog';

const translations = {
  en: {
    ...personalCatalogTranslations.en,
    ...blogTranslations.en,
  },
  zh: {
    ...personalCatalogTranslations.zh,
    ...blogTranslations.zh,
  },
};

export default translations;
