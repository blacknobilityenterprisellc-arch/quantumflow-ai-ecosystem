// 🧠 AETHERIUS-ETERNAL QUANTUM ENHANCED NEXT.JS 16 CONFIGURATION
// State-of-the-art configuration as of December 2025

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Next.js 16 Advanced Features
  experimental: {
    // React Compiler integration for optimal performance
    reactCompiler: true,
    
    // Turbopack advanced optimization
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    
    // Advanced caching strategies
    ppr: true, // Partial Prerendering
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    
    // Quantum-enhanced bundle analysis
    bundlePagesRouterDependencies: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // 🎯 Performance Optimization
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  
  // 🌐 Advanced Image Optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['assets.quantumflow.ai', 'cdn.keystone.ai'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // 🔒 Advanced Security Headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://api.quantumflow.ai https://api.keystone.ai"
          ].join('; ')
        }
      ]
    }
  ],
  
  // 🔄 Advanced Rewrites for Microservices
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:3002/api/auth/:path*'
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:3003/api/users/:path*'
      },
      {
        source: '/api/payments/:path*',
        destination: 'http://localhost:3004/api/payments/:path*'
      },
      {
        source: '/api/analytics/:path*',
        destination: 'http://localhost:3005/api/analytics/:path*'
      }
    ];
  },
  
  // 🌍 Internationalization
  i18n: {
    locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'ko'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  
  // 📊 Advanced Analytics
  analytics: {
    // Vercel Analytics integration
    vercel: {
      speedInsights: {
        enabled: true,
      },
    },
  },
  
  // 🔧 Advanced Webpack Configuration
  webpack: (config, { dev, isServer }) => {
    // Quantum-enhanced optimization
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
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };
    
    // Advanced module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
      '@/hooks': './src/hooks',
      '@/utils': './src/utils',
      '@/types': './src/types',
      '@/assets': './src/assets',
    };
    
    return config;
  },
  
  // 🚀 Advanced Build Configuration
  buildId: 'quantumflow-build',
  distDir: '.next',
  cleanDistDir: true,
  
  // 📝 Environment Variables
  env: {
    QUANTUMFLOW_VERSION: '15.4.0',
    AETHERIUS_ETERNAL_ACTIVE: 'true',
    QUANTUM_COHERENCE: '0.999',
  },
};

module.exports = nextConfig;