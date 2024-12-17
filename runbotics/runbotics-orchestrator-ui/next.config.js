module.exports = {
    rewrites: () => process.env.NODE_ENV === 'development'
        ? [
            {
                source: '/api/scheduler/:path*',
                destination: 'http://127.0.0.1:4000/api/scheduler/:path*',
            },
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8080/api/:path*', // The :path parameter is used here so will not be automatically passed in the query
            },
            {
                source: '/scheduler/:path*',
                destination: 'http://127.0.0.1:4000/scheduler/:path*',
            },
        ]
        : [],
    webpack: (config) => {
        config.resolve.fallback = { '@material-ui/core': false, '@material-ui/icons': false };

        return config;
    },
    publicRuntimeConfig: {
        runboticsEntrypointUrl: process.env.RUNBOTICS_ENTRYPOINT_URL || 'http://127.0.0.1:4000',
        mixpanelAnalyticsToken: process.env.MIXPANEL_ANALYTICS_TOKEN,
        copilotChatUrl: process.env.COPILOT_CHAT_URL
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
