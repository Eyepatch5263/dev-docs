import type { Metadata } from "next";
import { Inria_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const Inria_Serif_Font = Inria_Serif({
  subsets: ["latin"],
  variable: "--font-inria-serif",
  weight: ["400", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://explainbytes.tech";

export const metadata: Metadata = {
  title: "Explainbytes - Docs for Developers",
  description: "Comprehensive documentation for developers",
  keywords: [
    "system design",
    "developer documentation",
    "distributed systems",
    "databases",
    "networking",
  ],
  authors: [{ name: "Explainbytes", url: siteUrl }],
  openGraph: {
    type: "website",
    title: "Explainbytes - Docs for Developers",
    description: "Comprehensive documentation for developers",
    url: siteUrl,
    siteName: "Explainbytes",
    images: [
      {
        url: `${siteUrl}/explain.png`,
        width: 1200,
        height: 630,
        alt: "Explainbytes logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explainbytes - Docs for Developers",
    description: "Comprehensive documentation for developers",
    images: [`${siteUrl}/explain.png`],
  },
  icons: {
    icon: "/explain.png",
    apple: "/explain.png",
    shortcut: "/explain.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/explain.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/explain.png" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="canonical" href={siteUrl} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        {/* JSON-LD structured data (Organization + WebSite) */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is static and safe
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}#org`,
                  name: "Explainbytes",
                  url: siteUrl,
                  logo: `${siteUrl}/explain.png`,
                  sameAs: ["https://github.com/Eyepatch5263"],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}#website`,
                  url: siteUrl,
                  name: "Explainbytes",
                  publisher: { "@id": `${siteUrl}#org` },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${Inria_Serif_Font.className}`}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                style={{ fontFamily: "ui-serif" }}
                richColors
                position="top-right"
              />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
