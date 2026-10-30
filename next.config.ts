import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/projects", destination: "/#work", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/experience", destination: "/#about", permanent: true },
      { source: "/pull-requests", destination: "/", permanent: true },
      { source: "/highlights", destination: "/", permanent: true },
      { source: "/blogs/:slug*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
