import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.dodostatic.net",
        port: "",
        pathname: "/image/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "cdn.dodostatic.net",
        port: "",
        pathname: "/static/Img/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "cdn.inappstory.ru",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
