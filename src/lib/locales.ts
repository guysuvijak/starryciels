export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];