import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.thefrozengarden.com' },
      { protocol: 'https', hostname: 'tiimg.tistatic.com' },
      { protocol: 'https', hostname: 'media.istockphoto.com' },
      { protocol: 'https', hostname: 't3.ftcdn.net' },
      { protocol: 'https', hostname: 'www.shutterstock.com' },
    ],
  },
};

export default nextConfig;
