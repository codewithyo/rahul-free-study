/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.pw.live',
      },
      {
        protocol: 'https',
        hostname: 'd2bps9p1kiy4ka.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
