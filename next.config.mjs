/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore backend-related modules and directories
    config.resolve.alias = {
      ...config.resolve.alias,
      'fluent-ffmpeg': false,
      'ffmpeg': false,
      '@ffmpeg': false,
      'backend': false
    };
    
    // Also add them to externals
    config.externals = [
      ...(config.externals || []),
      'fluent-ffmpeg',
      'ffmpeg',
      '@ffmpeg'
    ];

    return config;
  }
};

export default nextConfig;
