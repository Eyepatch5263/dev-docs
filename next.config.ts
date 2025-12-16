import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// @ts-ignore - bundle analyzer doesn't have types
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Chain the plugins: first MDX, then bundle analyzer
export default withBundleAnalyzer(withMDX(nextConfig));