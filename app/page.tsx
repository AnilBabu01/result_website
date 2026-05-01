"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import LiveBar from "./components/LiveBar";

export default function Home() {
  const [date, setDate] = useState("");

  useEffect(() => {
    let today = new Date();

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    let formattedDate = today.toLocaleDateString("en-GB", options);

    let dayName = today.toLocaleDateString("en-US", {
      weekday: "long",
    });

    setDate(`${dayName.toUpperCase()}, ${formattedDate.toUpperCase()}`);

    document.title = `Kolkata FF Result Today ${formattedDate}`;
  }, []);

  return (
    <div className="min-h-screen  text-white">
      <Navbar />
      <LiveBar />

      <div className="max-w-6xl mx-auto px-3 pt-4 pb-10">
        
        {/* DATE */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-center py-2 rounded-lg font-bold shadow-md">
          🔴 {date}
        </div>

        {/* RESULT GRID */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-4 mt-4 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {["135", "500", "169", "445", "135", "500", "169", "445"].map(
              (num, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black p-4 text-center font-bold rounded-lg shadow hover:scale-105 transition"
                >
                  <p className="text-lg">{num}</p>
                  <p className="text-sm">1</p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <button
          onClick={() => location.reload()}
          className="block mx-auto mt-5 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition"
        >
          🔄 Refresh
        </button>

        {/* DOWNLOAD */}
        <button className="flex items-center justify-between mx-auto mt-5 bg-gradient-to-r from-green-400 to-green-600 px-4 py-3 rounded-xl font-bold w-full max-w-md shadow-lg hover:scale-105 transition">
          <img
            src="/images/kolkataff.png"
            alt="app"
            className="w-10 h-10 rounded-full"
          />

          <div className="text-center flex-1 text-black">
            <p className="text-sm">DOWNLOAD APP</p>
            <p className="text-xs">Fast Result</p>
          </div>

          <FaDownload className="text-black text-lg" />
        </button>

        {/* MULTIPLE GRIDS */}
        {[1, 2].map((_, idx) => (
          <div
            key={idx}
            className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-4 mt-4 rounded-xl shadow-lg"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {["135", "500", "169", "445", "135", "500", "169", "445"].map(
                (num, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black p-4 text-center font-bold rounded-lg shadow"
                  >
                    <p>{num}</p>
                    <p>1</p>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}

        <button className="block mx-auto mt-6 bg-yellow-400 text-black px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition">
          ⬇️ Load More
        </button>

        {/* SEO CONTENT */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-5 mt-6 rounded-xl leading-7 text-gray-300">
          <h1 className="text-xl font-bold text-yellow-400 mb-2">
            What is Kolkata FF?
          </h1>

          <p>
            Kolkata FF (Kolkata Fatafat) is a popular number-based guessing
            game played mainly in West Bengal. Users check live results daily.
          </p>

          <h2 className="text-lg font-bold text-yellow-400 mt-4">
            Kolkata FF Result Today
          </h2>

          <p>
            Results are updated multiple times daily. Players check after each
            round.
          </p>

          <h2 className="text-lg font-bold text-yellow-400 mt-4">
            Is Kolkata FF Legal?
          </h2>

          <p>
            It is illegal in many regions. We only provide informational data.
          </p>

          <h2 className="text-lg font-bold text-yellow-400 mt-4">
            Final Note
          </h2>

          <p>
            This is a luck-based game. Always play responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}