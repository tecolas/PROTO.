import type { NextConfig } from "next";

// When PAGES_BASE_PATH is set (e.g. "/PROTO./molho"), build a fully static
// copy of the site that GitHub Pages can serve from that sub-folder.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // don't let `next dev` drop AGENTS.md / CLAUDE.md into the project
  agentRules: false,
  transpilePackages: ["three"],
  ...(basePath
    ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }
    : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
