/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
