module.exports = {
    async rewrites() {
        console.log(process.env.NEXT_PUBLIC_RUNBOTICS_ENTRYPOINT_URL);
        return process.env.NODE_ENV === 'development'
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
            : [];
    },
    eslint: {
        //temp solution, remove when project is linted finally
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.resolve.fallback = { '@material-ui/core': false, '@material-ui/icons': false };

        return config;
    },
};
