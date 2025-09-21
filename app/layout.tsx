import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VectorSearch - Advanced Document Search Engine",
  description: "Experience next-generation document search with intelligent ranking, spelling correction, synonyms, and proximity-based results. Built with advanced vector space model algorithms.",
  keywords: ["search engine", "document search", "vector space model", "information retrieval", "text search", "ranking algorithms"],
  authors: [{ name: "VectorSearch Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "VectorSearch - Advanced Document Search Engine",
    description: "Experience next-generation document search with intelligent ranking and advanced features.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VectorSearch - Advanced Document Search Engine",
    description: "Experience next-generation document search with intelligent ranking and advanced features.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
