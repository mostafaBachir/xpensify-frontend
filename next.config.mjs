/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xpensifystorage.blob.core.windows.net',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_AUTH_API: process.env.NEXT_PUBLIC_AUTH_API,
    NEXT_PUBLIC_RECEIPT_API: process.env.NEXT_PUBLIC_RECEIPT_API,
  },
}

export default nextConfig
