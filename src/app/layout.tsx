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

export const metadata: Metadata = {
  title: "Developer Documentation",
  description: "A comprehensive guide to system design fundamentals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
