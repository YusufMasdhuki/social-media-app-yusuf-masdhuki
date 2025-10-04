/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'akcdn.detik.net.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.site.com',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'cdn.example.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
