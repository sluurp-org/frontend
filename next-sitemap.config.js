module.exports = {
  siteUrl: "https://sluurp.io",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 1,
  exclude: ["/workspaces/*", "/auth/*", "/workspaces/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/workspaces", "/auth/*", "/workspaces/*"],
      },
    ],
  },
};
