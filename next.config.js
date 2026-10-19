/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
  // Panel interno de cocina: página estática en /public + API protegida con PIN.
  async rewrites() {
    return {
      beforeFiles: [{source: "/cocina", destination: "/cocina.html"}],
    };
  },
  async headers() {
    return [
      {
        source: "/(cocina|cocina.html|api/cocina/:path*)",
        headers: [
          {key: "X-Robots-Tag", value: "noindex, nofollow"},
          {key: "Cache-Control", value: "no-store"},
        ],
      },
    ];
  },
};
