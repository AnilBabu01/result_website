import Navbar from "@/app/components/Navbar";
import LiveBar from "./components/LiveBar";
import HomeClient from "./components/HomeClient/index";

export const metadata = {
  title: "Sikkim FF Sikkim Fatafat Result Today Live | Sikkim FF Results",
  description:
    "Sikkim FF Sikkim Fatafat Result Today Live. Check the latest Sikkim Fatafat results, daily results, previous results, result history, lucky numbers, and fast updates. Get all Sikkim FF results in one place.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kolkata FF Result Today",
    url: "https://sikkimff.in",
    description: "Live Kolkata FF Results and Tips",
  };

  
  return (
    <>
      {/* SEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      <LiveBar />

      {/* CLIENT UI */}
      <HomeClient />
    </>
  );
}
