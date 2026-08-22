// app/sitemap.ts

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kolkataff.tech";

  const staticPages = [
    "",
    "tips",
    "luckynumber",
    "old-kolkata-ff-fatafat-result",
    "kolkata-ff-patti-list-chart-complete-full",
  ];

  return staticPages.map((page) => ({
    url: page ? `${baseUrl}/${page}` : baseUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: page === "" ? 1 : 0.9,
  }));
}