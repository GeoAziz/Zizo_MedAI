
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignore optional dependency warnings for a cleaner build log
    if (isServer) {
      config.externals.push('@opentelemetry/exporter-jaeger');
    }
    config.externals.push('handlebars');
    return config;
  },
};

export default nextConfig;
