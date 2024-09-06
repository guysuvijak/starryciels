import './globals.css';
import '@/styles/themes.css';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import Web3Provider from '@/components/(global)/Web3Provider';
import LayoutProvider from '@/components/(global)/Provider';
import { LocaleLayoutProps } from '@/types/(global)/Global';

function generateAlternateLinks(currentLocale: string, pathname: string) {
    const locales = ['en', 'th'];
    const baseUrl = 'https://starryciels.vercel.app/en';
    
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    
    const alternateLinks = locales
        .filter(locale => locale !== currentLocale)
        .map(locale => ({
            rel: 'alternate',
            hrefLang: locale,
            href: `${baseUrl}/${locale}${pathWithoutLocale}`
        }));
    
    alternateLinks.push({
        rel: 'alternate',
        hrefLang: 'x-default',
        href: `${baseUrl}${pathWithoutLocale}`
    });
    
    return alternateLinks;
};

export async function generateMetadata({ params: { locale } }: LocaleLayoutProps): Promise<Metadata> {
    const t = await getTranslations('Metadata');
    const headersList = headers();
    const pathname = headersList.get('x-invoke-path') || '';
  
    const title = t('title');
    const description = t('description');
    const domain = t('domain');
    const imageAlt = t('image-alt');

    const alternateLinks = generateAlternateLinks(locale, pathname);
    const currentUrl = `${domain}${pathname}`;
  
    return {
        manifest: '/metadata/manifest.json',
        title: title,
        description: description,
        openGraph: {
            type: 'website',
            title: title,
            description: description,
            url: currentUrl,
            siteName: title,
            images: [
            {
                url: '/metadata/manifest.png',
                alt: imageAlt,
                width: 1684,
                height: 640
            }
            ],
            locale: locale
        },
        alternates: {
            canonical: currentUrl,
            languages: Object.fromEntries(
                alternateLinks.map(link => [link.hrefLang, link.href])
            )
        },
        keywords: ['StarryCiels', 'on-chain', 'solana', 'game nft'],
        authors: [
            { name: title },
            {
                name: title,
                url: domain
            },
        ],
        icons: [
            { rel: 'apple-touch-icon', url: '/metadata/icon-128x128.png' },
            { rel: 'icon', url: '/metadata/icon-128x128.png' }
        ]
    };
};

export default async function LocaleLayout({children, params: {locale}}: LocaleLayoutProps) {
    const t = await getTranslations('Metadata');
    const messages = await getMessages();
    const headersList = headers();
    const pathname = headersList.get('x-invoke-path') || '';
    const alternateLinks = generateAlternateLinks(locale, pathname);
    const domain = t('domain');
    const currentUrl = `${domain}${pathname}`;

    return (
        <html lang={locale} style={{ height: '100%' }}>
            <head>
                <link rel='canonical' href={currentUrl} />
                {alternateLinks.map((link, index) => (
                    <link key={index} rel={link.rel} hrefLang={link.hrefLang} href={link.href} />
                ))}
            </head>
            <body className='bg-black' style={{display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Web3Provider>
                        <LayoutProvider locale={locale}>
                            <div className='flex flex-col flex-grow'>{children}</div>
                        </LayoutProvider>
                    </Web3Provider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
};