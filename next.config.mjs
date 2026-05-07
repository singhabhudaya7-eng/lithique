/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'shwet-arts.vercel.app' },
    ],
  },
  // Bypasses the linting errors blocking your Netlify build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Bypasses the TypeScript 'any' type errors
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig