/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/book',
        destination: '/contacts',
        permanent: true,
      },
      {
        source: '/que-hacer-en-carilo-en-invierno',
        destination: '/que-hacer-en-carilo/en-invierno',
        permanent: true,
      },
      {
        source: '/que-hacer-en-carilo-cuando-llueve',
        destination: '/que-hacer-en-carilo/cuando-llueve',
        permanent: true,
      },
    ]
  },
}

export default nextConfig