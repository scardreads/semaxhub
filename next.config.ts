import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import {
  CLERK_PROXY_PATH,
  clerkJsAssetUrl,
  clerkUiAssetUrl,
} from "./src/lib/clerk-proxy";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Pin Clerk assets to same-origin /__clerk. Cannot rewrite clerk.*.vercel.app
  // (different origin; TLS is dead). Relative proxy + these URLs keep clerk-js
  // off that host.
  env: {
    NEXT_PUBLIC_CLERK_PROXY_URL: CLERK_PROXY_PATH,
    NEXT_PUBLIC_CLERK_JS_URL: clerkJsAssetUrl(),
    NEXT_PUBLIC_CLERK_UI_URL: clerkUiAssetUrl(),
  },
  async redirects() {
    return [
      {
        source: "/how-it-may-work",
        destination: "/how-it-works",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  // remark-gfm omitted: Turbopack requires serializable options.
  // Tables are authored as HTML in MDX where needed.
});

export default withMDX(nextConfig);
