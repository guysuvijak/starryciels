import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from '@/lib/locales';
import type { AbstractIntlMessages } from 'next-intl';

const messageImports = {
    en: () => import('@/messages/en.json'),
    th: () => import('@/messages/th.json')
} as const satisfies Record<Locale, () => Promise<{ default: AbstractIntlMessages }>>;

export function isValidLocale(locale: unknown): locale is Locale {
    return locales.some((lang) => lang === locale);
};

export default getRequestConfig(async (params) => {
    const baseLocale = new Intl.Locale(params.locale).baseName;
    if (!isValidLocale(baseLocale)) notFound();
  
    const messages = (await messageImports[baseLocale]()).default;
    return {
        messages
    };
});