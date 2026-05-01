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
  metadataBase: new URL("https://kolkataff.cloud"),

  title: {
    default: "Kolkata FF Result Today | Fast Result & Tips",
    template: "%s | Kolkata FF",
  },

  description:
    "Check Kolkata FF Result Today, Old Results, Tips, Lucky Numbers and Daily Updates.",

  keywords: [
    "kolkata ff",
    "kolkata ff result today",
    "kolkata fatafat",
    "ff result",
    "kolkata ff tips",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Kolkata FF Result Today",
    description: "Daily Kolkata FF Results & Tips",
    url: "https://kolkataff.cloud",
    siteName: "Kolkata FF",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kolkata FF Result Today",
    description: "Fast Kolkata FF Results",
    images: ["/images/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}