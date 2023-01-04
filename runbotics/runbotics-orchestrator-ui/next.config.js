module.exports = {
    rewrites: () => process.env.NODE_ENV === 'development'
        ? [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*', // The :path parameter is used here so will not be automatically passed in the query
            },
            {
                source: '/scheduler/:path*',
                destination: 'http://localhost:4000/scheduler/:path*',
            },
        ]
        : [],
    webpack: (config) => {
        config.resolve.fallback = { '@material-ui/core': false, '@material-ui/icons': false };

        return config;
    },
    publicRuntimeConfig: {
        runboticsEntrypointUrl: process.env.RUNBOTICS_ENTRYPOINT_URL || 'http://localhost:4000',
    },
    serverRuntimeConfig: {
        mail_host: process.env.MAIL_HOST,
        mail_port: process.env.MAIL_PORT,
        mail_username: process.env.MAIL_USERNAME,
        mail_password: process.env.MAIL_PASSWORD,
    },
};
