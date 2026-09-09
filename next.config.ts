import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // remark-gfm omitted: Turbopack requires serializable options.
  // Tables are authored as HTML in MDX where needed.
});

export default withMDX(nextConfig);
