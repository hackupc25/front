import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('http://10.4.191.222:8000/media/**'),
      new URL('http://192.168.38.220:8000/media/**'),
      new URL('http://192.168.185.91:8000/media/**'),
    ].map(url => ({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
    })),
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  // Ensure Next.js listens on all network interfaces for development
  webpack: (config, { dev, isServer }) => {
    // Add any needed webpack customizations
    return config;
  },
};

module.exports = nextConfig;
