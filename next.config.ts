const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: '.next', // This is the default, but let's be explicit
};

export default nextConfig;