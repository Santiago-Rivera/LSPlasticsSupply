/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimizaciones para Vercel
  reactStrictMode: false, // Desactivado para evitar doble renderizado
  // Configuración para evitar fetch durante build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  }
};

export default nextConfig;
