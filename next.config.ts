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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pin.it',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
