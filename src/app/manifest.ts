import type { MetadataRoute } from 'next'

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Caltex Calculator',
    short_name: 'Caltex Calculator',
    description: 'Caltex StarCard Oil Price Calculator',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}