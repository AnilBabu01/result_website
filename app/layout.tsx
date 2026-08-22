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

  const title = `Kolkata Fatafat FF Result Today | Live Kolkata FF Results & Tips`;

  const description = `⭐ DADA ❤️ OFFICIAL WEBSITE ❤️⭐ Get Today’s Latest Bazi Tips & Live KOLKATA FF Result Updates for ${today}. Check the Kolkata Fatafat Result (कोलकाता फटाफट रिजल्ट), updated Patti List, expert Tips, and detailed Bazi Chart all in one place.`;

  return {
    metadataBase: new URL("https://kolkataff.tech"),

    title: {
      default: title,
      template: "%s | Kolkata Fatafat",
    },

    description,

    keywords: [
      "Kolkata FF",
      "Kolkata Fatafat",
      "Kolkata FF result today",
      "Kolkata Fatafat result",
      "Kolkata FF old result",
      "Kolkata FF tips",
      "Kolkata FF patti list",
      "Kolkata FF bazi chart",
      "Kolkata fatafat chart",
      "8 Bazi Tips",
      "Ghosh Babu Tips",
      "Live Result",
      "Patti Chart",
      "Satta Matka Kolkata",
    ],

    alternates: {
      canonical: "https://kolkataff.tech/",
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
      url: "https://kolkataff.tech/",
      siteName: "Kolkata Fatafat",
      locale: "en_IN",

      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Kolkata Fatafat FF Result",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Get fastest Kolkata FF results, old charts, daily tips and patti list online.",
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