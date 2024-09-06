import { ReactNode } from 'react';

export interface LocaleLayoutProps {
    children: ReactNode;
    params: { locale: string };
};

export interface ProviderProps {
    children: ReactNode;
    locale: string;
};

export interface Web3ProviderProps {
    children: ReactNode;
}

export interface TranslationProps {
    translate: string;
};