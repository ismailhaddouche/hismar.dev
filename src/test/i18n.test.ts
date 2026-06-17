import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createI18nManager } from '@/shared/i18n';

describe('I18nManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return translation for existing path', () => {
    const i18n = createI18nManager();
    i18n.setLanguage('en');
    const result = i18n.t('ui.placeholder');
    expect(result).toBe("Type 'help' to begin...");
  });

  it('should return path as fallback for missing key', () => {
    const i18n = createI18nManager();
    const result = i18n.t('nonexistent.path');
    expect(result).toBe('nonexistent.path');
  });

  it('should switch language and persist to localStorage', () => {
    const i18n = createI18nManager();
    i18n.setLanguage('es');
    expect(i18n.current).toBe('es');
    expect(localStorage.getItem('hismar_lang')).toBe('es');
  });

  it('should dispatch languageChanged event', () => {
    const dispatchSpy = vi.spyOn(document, 'dispatchEvent');
    const i18n = createI18nManager();
    i18n.setLanguage('en');
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'languageChanged',
        detail: 'en',
      })
    );
  });

  it('should use navigator language as default', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'es-ES',
      configurable: true,
    });
    localStorage.clear();
    const i18n = createI18nManager();
    expect(i18n.current).toBe('es');
  });

  it('should fallback to en for non-spanish navigator', () => {
    Object.defineProperty(navigator, 'language', {
      value: 'fr-FR',
      configurable: true,
    });
    localStorage.clear();
    const i18n = createI18nManager();
    expect(i18n.current).toBe('en');
  });
});
