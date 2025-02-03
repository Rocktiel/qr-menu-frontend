const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 gün
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // i18n: {
  //   locales: ["tr", "en"],
  //   defaultLocale: "tr",
  // },
  env: {
  NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    NEXT_PUBLIC_CLIENT_URL:
      process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  experimental: {
    staticPageGenerationTimeout: 300,
  },
};

module.exports = withPWA(nextConfig);
