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
      "https://qr-menu-api-1.onrender.com",
    NEXT_PUBLIC_CLIENT_URL:
      "https://qr-menu-api-2.onrender.com",
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
