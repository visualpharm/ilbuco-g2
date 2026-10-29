/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/imagekit-loader.ts',
  },
  // 3D model of the house: one self-contained page in public/3d/ (index.html + walk.mp4)
  async rewrites() {
    return [{ source: '/3d', destination: '/3d/index.html' }]
  },
  async redirects() {
    return [
      {
        source: '/book',
        destination: '/reservar',
        permanent: true,
      },
      // "Places nearby" is the Spanish "qué hacer" page; old and legacy URLs land on the right language.
      { source: '/places-nearby', destination: '/que-hacer-en-carilo', permanent: true },
      { source: '/activities', destination: '/que-hacer-en-carilo', permanent: true },
      { source: '/en/activities', destination: '/en/places-nearby', permanent: true },
      { source: '/pt/activities', destination: '/pt/places-nearby', permanent: true },
      { source: '/en/que-hacer-en-carilo', destination: '/en/places-nearby', permanent: true },
      { source: '/pt/que-hacer-en-carilo', destination: '/pt/places-nearby', permanent: true },
      { source: '/ru/que-hacer-en-carilo', destination: '/ru/places-nearby', permanent: true },
      { source: '/en/book', destination: '/reservar', permanent: false },
      { source: '/pt/book', destination: '/reservar', permanent: false },
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