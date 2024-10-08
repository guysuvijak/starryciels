/** @type {import('next').NextConfig} */
require('dotenv').config();

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com;
    child-src 'self' https://www.youtube.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: http:;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'self' data:;
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://discord.com https://youtu.be https://youtube.com https://www.youtube.com https://widget.solflare.com https://connect.solflare.com;
    frame-ancestors 'self' https://localhost:* http://localhost:* https://*.localhost:* http://*.localhost:* https://discord.com https://youtube.com;
    connect-src 'self' https: http: wss: https://www.youtube.com https://youtu.be;
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
            }
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
        NETWORK_RPC: process.env.NETWORK_RPC,
        RPC_URL: process.env.RPC_URL,
        ADDRESS_CREATOR: process.env.ADDRESS_CREATOR,
        ADDRESS_COLLECTION_PLANET: process.env.ADDRESS_COLLECTION_PLANET,
        ADDRESS_COLLECTION_PROFILE: process.env.ADDRESS_COLLECTION_PROFILE,
        ADDRESS_SIGNER: process.env.ADDRESS_SIGNER,
        SECRET_KEY_BASE64: process.env.SECRET_KEY_BASE64,
        PROFILE_PINATA: process.env.PROFILE_PINATA,
        PLANET_PINATA: process.env.PLANET_PINATA,
        PLANET_COL_PINATA: process.env.PLANET_COL_PINATA,
        PROFILE_WEBHOOK: process.env.PROFILE_WEBHOOK,
        PLANET_WEBHOOK: process.env.PLANET_WEBHOOK
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