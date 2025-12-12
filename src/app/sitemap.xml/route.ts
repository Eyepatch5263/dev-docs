import { NextResponse } from "next/server";
import { getAllDocs } from "@/lib/docs";
import fs from "fs";
import path from "path";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://explainbytes.tech";

export async function GET() {
  try {
    const docs = getAllDocs();

    // Build URL entries; try to get lastmod from file mtime when possible
    const urlEntries = docs.map((doc) => {
      const parts = doc.slug.split("/");
      // doc.slug is topic/slug
      const filePath = path.join(process.cwd(), "content", parts[0], `${parts.slice(1).join("/")}.mdx`);
      let lastmod = undefined;

      try {
        const stat = fs.statSync(filePath);
        lastmod = stat.mtime.toISOString();
      } catch (e) {
        // ignore
      }

      const loc = `${siteUrl}/${doc.slug}`.replace(/\/g, "/");

      return { loc, lastmod };
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries
      .map((u) =>
        `<url>\n  <loc>${u.loc}</loc>${u.lastmod ? `\n  <lastmod>${u.lastmod}</lastmod>` : ""}\n</url>`
      )
      .join("\n")}\n</urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    return new NextResponse("", { status: 500 });
  }
}
