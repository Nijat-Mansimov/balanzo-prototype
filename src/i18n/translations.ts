import { en } from './locales/en';
import { az } from './locales/az';
import { tr } from './locales/tr';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { ru } from './locales/ru';

export type LanguageCode = 'en' | 'az' | 'es' | 'fr' | 'de' | 'tr' | 'ru';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  localeTag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English (US)', nativeName: 'English', flag: '🇺🇸', localeTag: 'en-US' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', localeTag: 'az-AZ' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', localeTag: 'tr-TR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', localeTag: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', localeTag: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', localeTag: 'de-DE' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', localeTag: 'ru-RU' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en,
  az,
  tr,
  es,
  fr,
  de,
  ru,
};
