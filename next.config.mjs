/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/extension-accelerate']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client', '@prisma/extension-accelerate')
    }
    return config
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'utils', 'hooks', 'app']
  }
};

export default nextConfig;