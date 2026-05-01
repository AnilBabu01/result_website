import Navbar from "@/app/components/Navbar";
import LiveBar from "../components/LiveBar";
import HomeClient from "../components/TpisClient/index";

export const metadata = {
  title: "Kolkata FF Result Today Live",
  description:
    "Live Kolkata FF Results Today. Check fastest updates, tips, lucky numbers and old results.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kolkata FF Result Today",
    url: "https://kolkataff.cloud",
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
