"use client";

import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";

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

    document.title = `Kolkata FF Result Today ${formattedDate} Live Updates`;
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* 🔴 LIVE BAR */}
      <div className="bg-red-500 text-white flex items-center overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-red-600 font-bold whitespace-nowrap">
          LIVE <span className="blink text-lg">🔴</span>
        </div>

        <div className="overflow-hidden w-full">
          <div className="animate-scroll font-bold py-2">
            | Daily Updated Result Website | Kolkata FF Result Today | Fast
            Update | Check Now 🔥 |
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3">
        {/* DATE */}
        <div className="bg-yellow-400 text-center p-2 font-bold rounded">
          🔴 {date}
        </div>

        {/* RESULT GRID */}
        <div className="bg-white p-3 mt-3 rounded">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {["135", "500", "169", "445", "135", "500", "169", "445"].map(
              (num, i) => (
                <div
                  key={i}
                  className="bg-gray-300 p-4 text-center font-bold rounded"
                >
                  <p>{num}</p>
                  <p>1</p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* BUTTONS */}
        <button
          onClick={() => location.reload()}
          className="block mx-auto mt-4 bg-yellow-400 px-6 py-2 rounded-full font-bold"
        >
          Refresh Karo
        </button>

        <button
          onClick={() => location.reload()}
          className="flex items-center justify-between mx-auto mt-4 bg-green-400 px-4 py-3 rounded-full font-bold w-full max-w-md shadow-md"
        >
          <img
            src="/images/kolkataff.png"
            alt="app"
            className="w-10 h-10 rounded-full"
          />

          <div className="text-center flex-1">
            <p className="text-sm">DOWNLOAD APP</p>
            <p className="text-xs">Get Result Faster</p>
          </div>

          <div className="text-lg">
            <FaDownload />
          </div>
        </button>
        {/* RESULT GRID */}
        <div className="bg-white p-3 mt-3 rounded">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {["135", "500", "169", "445", "135", "500", "169", "445"].map(
              (num, i) => (
                <div
                  key={i}
                  className="bg-gray-300 p-4 text-center font-bold rounded"
                >
                  <p>{num}</p>
                  <p>1</p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* RESULT GRID */}
        <div className="bg-white p-3 mt-3 rounded">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {["135", "500", "169", "445", "135", "500", "169", "445"].map(
              (num, i) => (
                <div
                  key={i}
                  className="bg-gray-300 p-4 text-center font-bold rounded"
                >
                  <p>{num}</p>
                  <p>1</p>
                </div>
              ),
            )}
          </div>
        </div>

        <button
          onClick={() => location.reload()}
          className="block mx-auto mt-4 bg-yellow-400 px-6 py-2 rounded-full font-bold"
        >
          ⬇️ Load More
        </button>

        {/* 🔥 SEO CONTENT START */}
        <div className="bg-white p-4 mt-5 rounded shadow-sm leading-7">
          <h1 className="text-xl font-bold mb-2">What is Kolkata FF?</h1>

          <p className="text-gray-700">
            Kolkata FF (Kolkata Fatafat) is a popular number-based guessing game
            played mainly in West Bengal. Many users visit online platforms
            daily to check fast Kolkata FF results, old charts, and live
            updates. This website provides today’s results and previous records
            in one place for free.
          </p>

          <h2 className="text-lg font-bold mt-4">Kolkata FF Result Today</h2>

          <p className="text-gray-700">
            Kolkata Fatafat results are updated multiple times daily. Players
            check results after each round to see if their selected number
            matches the winning result. You can also explore past results and
            10-day charts here easily.
          </p>

          <h2 className="text-lg font-bold mt-4">Is Kolkata FF Legal?</h2>

          <p className="text-gray-700">
            This game is considered illegal in many parts of India. It is played
            at the user’s own risk. We only provide result information and do
            not promote gambling in any way.
          </p>

          <h2 className="text-lg font-bold mt-4">Kolkata FF Tips</h2>

          <p className="text-gray-700">
            There is no guaranteed trick to win Kolkata FF. The game is
            completely based on luck. Many online sources claim to provide fixed
            numbers, but most of them are fake. Always avoid paying money for
            such tips.
          </p>

          <h2 className="text-lg font-bold mt-4">
            How to Check Kolkata FF Result
          </h2>

          <ul className="list-disc pl-5 text-gray-700">
            <li>Open this website</li>
            <li>Find today’s result section</li>
            <li>Match your number with result</li>
            <li>If matched, you win</li>
          </ul>

          <h2 className="text-lg font-bold mt-4">Kolkata FF Old Result</h2>

          <p className="text-gray-700">
            You can check previous results using the result table available on
            this page. It helps users analyze patterns and understand past
            trends.
          </p>

          <h2 className="text-lg font-bold mt-4">Final Note</h2>

          <p className="text-gray-700">
            Kolkata FF is purely a luck-based game. Always play responsibly and
            never invest more than you can afford to lose. This website only
            provides fast and accurate result updates for informational
            purposes.
          </p>
        </div>
        {/* 🔥 SEO CONTENT END */}
      </div>
    </div>
  );
}
