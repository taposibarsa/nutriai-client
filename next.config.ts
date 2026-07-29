import type { NextConfig } from "next";

/**
 * Must stay aligned with ALLOWED_IMAGE_HOSTS / suffixes in src/lib/imageHosts.ts
 */
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "www.gravatar.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "gravatar.com" },
      { protocol: "https", hostname: "**.gravatar.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "static.pexels.com" },
      { protocol: "https", hostname: "www.pexels.com" },
      { protocol: "https", hostname: "pexels.com" },
      { protocol: "https", hostname: "**.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "pixabay.com" },
      { protocol: "https", hostname: "www.pixabay.com" },
      { protocol: "https", hostname: "**.pixabay.com" },
      { protocol: "https", hostname: "i.imgur.com" },
    ],
  },
};

export default nextConfig;
