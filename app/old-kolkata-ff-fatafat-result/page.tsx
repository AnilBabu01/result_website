"use client";

import Navbar from "../components/Navbar";
import LiveBar from "../components/LiveBar";
import { useRouter } from "next/navigation";

export default function OldPage() {
  const router = useRouter();

  // Generate months from Jan 2024 to May 2026
  const generateMonths = () => {
    const start = new Date(2024, 0);
    const end = new Date(2026, 4);

    const months: { label: string; month: number; year: number }[] = [];
    let current = new Date(start);

    while (current <= end) {
      const monthName = current.toLocaleString("default", {
        month: "long",
      });

      const year = current.getFullYear();
      const month = current.getMonth() + 1; // 1-12

      months.push({
        label: `${monthName} ${year}`,
        month,
        year,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return months.reverse();
  };

  const months = generateMonths();

  return (
    <div className="min-h-screen text-black">
      <Navbar />
      <LiveBar />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            📊 ARCHIVED RESULTS
          </h1>

          <p className="text-gray-400 mt-2">
            Browse monthly charts and view detailed 8 Bazi results
          </p>
        </div>

        {/* MONTH GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {months.map((item, index) => (
            <button
              key={index}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-xl p-5 shadow-lg hover:scale-[1.03] transition-all text-left"
              onClick={() => {
                router.push(
                  `/old-kolkata-ff-fatafat-result/monthly/${item.year}/${item.month}`
                );
              }}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-yellow-400">
                    {item.label}
                  </p>
                  <p className="text-sm text-gray-400">
                    View full chart →
                  </p>
                </div>

                <div className="text-2xl">📁</div>
              </div>
            </button>
          ))}
        </div>

        {/* INFO CARD */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-5 rounded-xl text-gray-300 leading-7">
          <h2 className="text-yellow-400 font-bold mb-2">
            About Archived Charts
          </h2>

          <p>
            These charts contain historical results of all 8 Bazi categories.
            Use them to analyze patterns, trends, and improve your prediction strategies.
          </p>

          <p className="mt-3 text-green-400">
            ⚠️ Results are for reference only. No guarantee of future outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}