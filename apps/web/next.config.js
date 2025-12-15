/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@nous/shared', '@nous/ui'],
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000'],
        },
    },
};

module.exports = nextConfig;
