/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.pw.live' },
      { protocol: 'https', hostname: 'd2bps9p1kiy4ka.cloudfront.net' },
    ],
  },
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Similarly, ignore type errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
