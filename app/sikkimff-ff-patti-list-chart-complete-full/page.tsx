import Navbar from "@/app/components/Navbar";
import LiveBar from "../components/LiveBar";
import HomeClient from "../components/PattiClient/index";

export const metadata = {
  title: "sikkimFF Result Today Live",
  description:
    "Live sikkimFF Results Today. Check fastest updates, tips, lucky numbers and old results.",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "sikkim FF Result Today",
    url: "https://sikkimff.online",
    description: "Live sikkimFF Results and Tips",
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
