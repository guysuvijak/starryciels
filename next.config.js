/** @type {import('next').NextConfig} */
require('dotenv').config();

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com;
    child-src 'self' https://www.youtube.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: http:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://discord.com https://youtube.com https://www.youtube.com https://widget.solflare.com;
    frame-ancestors 'self' https://localhost:* http://localhost:* https://*.localhost:* http://*.localhost:* https://discord.com https://youtube.com;
    connect-src 'self' https: http: wss: https://www.youtube.com;
    upgrade-insecure-requests;
`

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV !== 'development',
    },
    webpack: (config, { isServer }) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        if (!isServer) {
            config.resolve.fallback = { 
                ...config.resolve.fallback,
                fs: false, 
                net: false, 
                tls: false,
                crypto: require.resolve('crypto-browserify')
            };
        }
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
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
                    {
                      key: 'Referrer-Policy',
                      value: 'strict-origin-when-cross-origin'
                    }
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
                        value: 'starryciels.vercel.app',
                    },
                ],
                destination: 'http://starryciels.vercel.app/:path*',
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
        DATABASE_URL: process.env.DATABASE_URL,
        NETWORK_RPC: process.env.NETWORK_RPC,
        RPC_URL: process.env.RPC_URL
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