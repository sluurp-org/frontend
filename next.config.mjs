/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  transpilePackages: [
    "antd",
    "@babel/runtime",
    "@ant-design/icons",
    "@ant-design/icons-svg",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
  ],
};

export default nextConfig;
