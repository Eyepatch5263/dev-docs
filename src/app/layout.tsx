import type { Metadata } from "next";
import { Inria_Sans, Inria_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const Inria_Sans_Font = Inria_Sans({
  subsets: ["latin"],
  variable: "--font-inria-sans",
  weight: ["400", "700"],
});

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
        url: `${siteUrl}/logo.svg`,
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
    images: [`${siteUrl}/logo.svg`],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
    shortcut: "/logo.svg",
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
        <link rel="icon" href="/logo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="canonical" href={siteUrl} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        {/* JSON-LD structured data (Organization + WebSite) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}#org`,
                  "name": "Explainbytes",
                  "url": siteUrl,
                  "logo": `${siteUrl}/logo.svg`,
                  "sameAs": [
                    "https://github.com/Eyepatch5263"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}#website`,
                  "url": siteUrl,
                  "name": "Explainbytes",
                  "publisher": { "@id": `${siteUrl}#org` },
                }
              ]
            }),
          }}
        />
      </head>
      <body
        className={`${Inria_Serif_Font.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
