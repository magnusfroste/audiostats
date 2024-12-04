/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Replace ffmpeg modules with empty objects
    config.resolve.alias = {
      ...config.resolve.alias,
      'fluent-ffmpeg': false,
      'ffmpeg': false,
      '@ffmpeg': false,
      '@ffmpeg-installer/ffmpeg': false,
      'ffmpeg-static': false
    };

    // Add to externals
    config.externals = [
      ...(config.externals || []),
      'fluent-ffmpeg',
      'ffmpeg',
      '@ffmpeg',
      '@ffmpeg-installer/ffmpeg',
      'ffmpeg-static'
    ];

    // Ignore backend directory
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...config.module.rules,
        {
          test: /backend\//,
          loader: 'ignore-loader'
        }
      ]
    };

    return config;
  }
};

export default nextConfig;
