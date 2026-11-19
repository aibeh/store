/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Solo en desarrollo: permite abrir la web local desde el celular por wifi.
  allowedDevOrigins: ["192.168.0.177"],
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
      beforeFiles: [
        {source: "/cocina", destination: "/cocina.html"},
        {source: "/clientes", destination: "/clientes.html"},
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/(cocina|cocina.html|api/cocina/:path*|clientes|clientes.html|api/cuenta/:path*|api/clientes-admin/:path*)",
        headers: [
          {key: "X-Robots-Tag", value: "noindex, nofollow"},
          {key: "Cache-Control", value: "no-store"},
        ],
      },
    ];
  },
};
