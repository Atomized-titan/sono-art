import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { Providers } from "@/lib/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://sonolise.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Sonolise | Transform Songs into Visuals",
    template: "%s",
  },
  description:
    "Transform your favorite songs into stunning visuals with Sonolise. Create, share, and explore beautiful song artworks.",
  keywords: ["music", "visualization", "artwork", "song", "album", "spotify"],
  authors: [{ name: "Sonolise Team" }],
  creator: "Sonolise",
  publisher: "Sonolise Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Sonolise",
    title: "Sonolise | Transform Songs into Visuals",
    description:
      "Create stunning visuals from your favorite songs with Sonolise",
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Sonolise - Song Visualization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sonolise",
    creator: "@sonolise",
    title: "Sonolise | Transform Songs into Visuals",
    description:
      "Create stunning visuals from your favorite songs with Sonolise",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
