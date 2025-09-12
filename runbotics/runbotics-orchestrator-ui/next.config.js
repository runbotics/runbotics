/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: '/ui-assets',

    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/ui-assets/_next/:path+',
                    destination: '/_next/:path+',
                },
            ],
        }
    },

    webpack: (config) => {
        config.resolve.fallback = { '@material-ui/core': false, '@material-ui/icons': false };
        return config;
    },

    publicRuntimeConfig: {
        runboticsEntrypointUrl: process.env.RUNBOTICS_ENTRYPOINT_URL || 'http://localhost:4000',
        mixpanelAnalyticsToken: process.env.MIXPANEL_ANALYTICS_TOKEN,
        copilotChatUrl: process.env.COPILOT_CHAT_URL,
        isSsoEnabled: process.env.IS_SSO_ENABLED,
    },

    modularizeImports: {
        '@mui/icons-material': {
            transform: '@mui/icons-material/{{member}}',
        },
        '@mui/material': {
            transform: '@mui/material/{{member}}',
        }
    },

    serverRuntimeConfig: {
        mailHost: process.env.MAIL_HOST,
        mailPort: process.env.MAIL_PORT,
        mailUsername: process.env.MAIL_USERNAME,
        mailPassword: process.env.MAIL_PASSWORD,
        runboticsPluginsDir: process.env.RUNBOTICS_PLUGINS_DIR,
        runboticsEntrypointUrl: process.env.RUNBOTICS_ENTRYPOINT_URL || 'http://127.0.0.1:3000',
    },

    images: {
        domains: ["images.ctfassets.net"]
    },

    // consts declared at: runbotics\runbotics\runbotics-orchestrator-ui\src\src-app\translations\translations.ts
    i18n: {
        locales: ['en', 'pl'],
        defaultLocale: 'en',
        localeDetection: false,
    },
    
    poweredByHeader: false,
};

module.exports = nextConfig;
