/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  cacheComponents: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    exposeTestingApiInProductionBuild: process.env.EXPOSE_TESTING_API === "1",
    staleTimes: {
      static: 900,
      dynamic: 0,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};
