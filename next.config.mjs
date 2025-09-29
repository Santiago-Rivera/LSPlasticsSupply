/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para balanceador de carga
  output: 'standalone',

  // Optimizaciones de rendimiento para alto tráfico
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
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
          {
            key: 'X-Instance-ID',
            value: process.env.INSTANCE_ID || 'default',
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
      {
        source: '/productos.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300', // Cache 5 minutos para reducir carga
          },
        ],
      },
    ];
  },

  // Configuración de imágenes optimizadas
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 300,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Variables de entorno públicas
  env: {
    INSTANCE_ID: process.env.INSTANCE_ID || 'default',
    LOAD_BALANCER_ENABLED: 'true',
  },

  // Configuración de webpack para optimización
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Optimizaciones para bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
};

export default nextConfig;
