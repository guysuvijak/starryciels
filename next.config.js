/** @type {import('next').NextConfig} */
require('dotenv').config();

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: http:;
    font-src 'self';
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://discord.com https://youtube.com https://www.youtube.com;
    frame-ancestors 'self' https://localhost:* http://localhost:* https://*.localhost:* http://*.localhost:* https://discord.com https://youtube.com;
    connect-src 'self' https: http: wss:;
    upgrade-insecure-requests;
`

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV !== 'development',
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        config.resolve.fallback = { 
            ...config.resolve.fallback,
            fs: false, 
            net: false, 
            tls: false 
        };
        return config;
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Permissions-Policy',
                        value: 'interest-cohort=()',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: cspHeader.replace(/\n/g, ''),
                    },
                ],
            },
        ];
    },
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/en',
                permanent: true,
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'localhost:3000',
                    },
                ],
                destination: 'http://localhost:3000:path*',
                permanent: true,
            },
        ];
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            { hostname: 'www.google.com' },
            { hostname: 'cdn.discordapp.com' }
        ]
    },
    env: {
        DATABASE_URL: process.env.DATABASE_URL
    }
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
});

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true
});

const withNextIntl = require('next-intl/plugin')(
    './src/i18n.ts'
);

module.exports = withBundleAnalyzer(withPWA(withNextIntl(nextConfig)));