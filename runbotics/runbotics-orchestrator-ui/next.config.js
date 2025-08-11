const PROXY_HOST = `http://localhost:8888`
const IS_PROXYING_ENABLED = ['on', '1', 'yes'].includes(process.env.DEV_PROXY_ENABLED?.toLowerCase())

const API_HOST = IS_PROXYING_ENABLED ? PROXY_HOST : `http://127.0.0.1:8080`
const SCHEDULER_HOST = IS_PROXYING_ENABLED ? PROXY_HOST : `http://127.0.0.1:4000`

const FALLBACK_RUNBOTICS_ENTRY_URL = IS_PROXYING_ENABLED ? PROXY_HOST : 'http://127.0.0.1:4000'

module.exports = {
    rewrites: () => process.env.NODE_ENV === 'development'
        ? [
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
                destination: `${API_HOST}/api/:path*`, // The :path parameter is used here so will not be automatically passed in the query
            },
            {
                source: '/scheduler/:path*',
                destination: `${SCHEDULER_HOST}/scheduler/:path*`,
            },
        ]
        : [],
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
        domains: [ "images.ctfassets.net" ]
    },

    // consts declared at: runbotics\runbotics\runbotics-orchestrator-ui\src\src-app\translations\translations.ts
    i18n: {
        locales: [ 'en', 'pl' ],
        defaultLocale: 'en',
        localeDetection: false,
    },
};
