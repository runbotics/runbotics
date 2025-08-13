const PROXY_HOST = `http://localhost:8888`
const IS_PROXYING_ENABLED = ['on', '1', 'yes'].includes(process.env.DEV_PROXY_ENABLED?.toLowerCase())

// Service hosts configuration
const API_HOST = IS_PROXYING_ENABLED ? PROXY_HOST : `http://127.0.0.1:8080`
const SCHEDULER_HOST = IS_PROXYING_ENABLED ? PROXY_HOST : `http://127.0.0.1:4000`
const UI_HOST = IS_PROXYING_ENABLED ? PROXY_HOST : `http://127.0.0.1:3000`

const FALLBACK_RUNBOTICS_ENTRY_URL = IS_PROXYING_ENABLED ? PROXY_HOST : 'http://127.0.0.1:4000'

const assetPrefix = 'lp'
const commonRewrites = [
    {
        source: `/${assetPrefix}/_next/:path+`,
        destination: '/_next/:path+',
    },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    assetPrefix: `/${assetPrefix}`,

    rewrites: async () => ({
        beforeFiles: process.env.NODE_ENV === 'development'
            ? [
                ...commonRewrites,
                {
                    source: '/ui/:path*',
                    destination: `${UI_HOST}/ui/:path*`,
                },
                {
                    source: '/api/plugins/:path*',
                    destination: '/api/plugins/:path*',
                },
                {
                    source: '/api/scheduler/:path*',
                    destination: `${SCHEDULER_HOST}/api/scheduler/:path*`,
                },
                {
                    source: '/api/:path*',
                    destination: `${API_HOST}/api/:path*`,
                },
                {
                    source: '/scheduler/:path*',
                    destination: `${SCHEDULER_HOST}/scheduler/:path*`,
                },
            ]
            : [
                ...commonRewrites,
            ],
    }),

    webpack: (config) => {
        config.resolve.fallback = { '@material-ui/core': false, '@material-ui/icons': false };
        return config;
    },

    publicRuntimeConfig: {
        runboticsEntrypointUrl: process.env.RUNBOTICS_ENTRYPOINT_URL || FALLBACK_RUNBOTICS_ENTRY_URL,
        mixpanelAnalyticsToken: process.env.MIXPANEL_ANALYTICS_TOKEN,
        copilotChatUrl: process.env.COPILOT_CHAT_URL,
        isSsoEnabled: process.env.IS_SSO_ENABLED,
    },

    serverRuntimeConfig: {
        mailHost: process.env.MAIL_HOST,
        mailPort: process.env.MAIL_PORT,
        mailUsername: process.env.MAIL_USERNAME,
        mailPassword: process.env.MAIL_PASSWORD,
        runboticsPluginsDir: process.env.RUNBOTICS_PLUGINS_DIR,
        runboticsEntrypointUrl: process.env.RUNBOTICS_ENTRYPOINT_URL || 'http://127.0.0.1:3000',
    },

    modularizeImports: {
        '@mui/icons-material': {
            transform: '@mui/icons-material/{{member}}',
        },
        '@mui/material': {
            transform: '@mui/material/{{member}}',
        }
    },

    images: {
        domains: ["images.ctfassets.net"]
    },

    i18n: {
        locales: ['en', 'pl'],
        defaultLocale: 'en',
        localeDetection: false,
    },
}

module.exports = nextConfig
