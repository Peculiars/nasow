import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  
  // ✅ Add this as well if the above doesn't work
  serverRuntimeConfig: {
    maxDuration: 60, // Maximum execution time in seconds
  },
};
