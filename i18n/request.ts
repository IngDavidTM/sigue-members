import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import enMessages from '@/dictionaries/en.json';
import esMessages from '@/dictionaries/es.json';

const messagesByLocale = {
  en: enMessages,
  es: esMessages,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messagesByLocale[locale as keyof typeof messagesByLocale],
  };
});
