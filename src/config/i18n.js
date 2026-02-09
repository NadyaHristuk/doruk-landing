import uaJson from '../lang/ua.json';
import enJson from '../lang/en.json';

export const langs = ['ua', 'en'];
export const defaultLang = 'en';

export const translate = (key, lang) => {
  const dict = lang === 'ua' ? uaJson : enJson;
  return key
    .split('.')
    .reduce(
      (obj, k) => (obj && obj[k] !== undefined ? obj[k] : undefined),
      dict
    );
};
