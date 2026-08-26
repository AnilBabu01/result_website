import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = "https://kolkataff.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const staticPages = [
    "",
    "tips",
    "luckynumber",
    "old-kolkata-ff-fatafat-result",
    "kolkata-ff-patti-list-chart-complete-full",
  ];

  const urls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: page
      ? `${baseUrl}/${page}`
      : baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: page === "" ? 1 : 0.9,
  }));

  /*
   * Generate monthly URLs
   */
  for (let year = 2024; year <= currentYear; year++) {
    const maxMonth =
      year === currentYear
        ? currentMonth
        : 12;

    for (let month = 1; month <= maxMonth; month++) {
      const monthString = String(month).padStart(2, "0");

      urls.push({
        url: `${baseUrl}/old-kolkata-ff-fatafat-result/monthly/${year}/${monthString}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  return urls;
}