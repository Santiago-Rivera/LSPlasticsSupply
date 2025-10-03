/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para balanceador de carga
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Compresión habilitada
  compress: true,

  // Configuración de imágenes optimizadas
  images: {
    unoptimized: true,
  },

  // Configuración de webpack para optimización
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
