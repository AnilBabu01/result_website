import type { Metadata } from "next";
import "./globals.css";

import Providers from "./Providers";

// Generate today's date dynamically
function getTodayDate(): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function getTodayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function generateMetadata(): Promise<Metadata> {
  const today = getTodayDate();
  const todayISO = getTodayISO();

  const title = `sikkim Fatafat fatafat Result Today | Live sikkim fatafat Results & Tips`;

  const description = `⭐ DADA ❤️ OFFICIAL WEBSITE ❤️⭐ Get Today’s Latest Bazi Tips & Live sikkim fatafat Result Updates for ${today}. Check the sikkimff Fatafat Result  updated Patti List, expert Tips, and detailed Bazi Chart all in one place.`;

  return {
    metadataBase: new URL("https://sikkimffff.in"),

    title: {
      default: title,
      template: "%s | sikkimff Fatafat",
    },

    description,

    keywords: [
      "sikkimff FF",
      "sikkimff fatafat",
      "sikkimff FF result today",
      "sikkimff Fatafat result",
      "sikkimff FF old result",
      "sikkimff FF tips",
      "sikkimff FF patti list",
      "sikkimff FF bazi chart",
      "sikkimff fatafat chart",
      "8 Bazi Tips",
      "Ghosh Babu Tips",
      "Live Result",
      "Patti Chart",
      "Satta Matka sikkimff",
    ],

    alternates: {
      canonical: "https://sikkimffff.in",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: "https://sikkimffff.in",
      siteName: "Kolkata Fatafat",
      locale: "en_IN",

      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "sikkimff Fatafat FF Result",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Get fastest sikkimff FF results, old charts, daily tips and patti list online.",
      images: ["/og.png"],
    },

    verification: {
      google: [
        "lwTXJYpUpzMkcgabdJISSC0U3sM1wxPrCrEYn5YO4TI",
        "6wc9Huv8Sgbay1bFFst7c-fUKCTIM5GDnnErNURArsA",
      ],
    },

    other: {
      "article:published_time": `${todayISO}T00:00:00+05:30`,
      "article:modified_time": `${todayISO}T18:00:00+05:30`,
      "og:updated_time": `${todayISO}T18:00:00+05:30`,
      "revisit-after": "1 days",
      "last-modified": new Date().toUTCString(),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}