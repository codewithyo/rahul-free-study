/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'static.pw.live' },
      { protocol: 'https', hostname: 'd2bps9p1kiy4ka.cloudfront.net' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable Turbopack if it causes issues with Gradle caches in logs
  experimental: {
    // turbopack: false 
  }
};

export default nextConfig;
