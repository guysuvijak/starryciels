import createMiddleware from 'next-intl/middleware';
import { locales, type Locale } from '@/utils/locales';
import type { NextRequest, NextResponse } from 'next/server';

const nextIntlMiddleware = createMiddleware({
    locales,
    defaultLocale: 'en' satisfies Locale,
    alternateLinks: false
});

export const config = {
    matcher: ['/', '/(en|th)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};

export default function middleware(req: NextRequest): NextResponse {
    return nextIntlMiddleware(req);
};