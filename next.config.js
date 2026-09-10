/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
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
