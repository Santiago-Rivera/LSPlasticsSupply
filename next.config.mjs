/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para balanceador de carga
  output: 'standalone',

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Compresión habilitada
  compress: true,

  // Headers de seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

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

      // Fix para el error "self is not defined"
      config.resolve.alias = {
        ...config.resolve.alias,
        'self': false,
      };
    }

    return config;
  },
};

export default nextConfig;
