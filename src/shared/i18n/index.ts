import type { I18nTranslations } from '@/core/types';
import es from './translations/es.json';
import en from './translations/en.json';

const STORAGE_KEY = 'hismar_lang';

export interface I18n {
  readonly current: string;
  t<T = string>(path: string): T;
  setLanguage(lang: string): void;
}

export function createI18nManager(): I18n {
  const translations: I18nTranslations = { es, en };

  const manager: I18n = {
    get current() {
      return getCurrentLang();
    },

    t<T = string>(path: string): T {
      return resolvePath(translations[manager.current]!, path) as T;
    },

    setLanguage(lang: string) {
      if (!translations[lang]) return;
      localStorage.setItem(STORAGE_KEY, lang);
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    },
  };

  return manager;
}

function getCurrentLang(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;
  return navigator.language.startsWith('es') ? 'es' : 'en';
}

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let result: unknown = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return result;
}
