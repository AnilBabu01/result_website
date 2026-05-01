"use client";

import { use } from "react";
import Navbar from "@/app/components/Navbar";
import LiveBar from "@/app/components/LiveBar";
import Link from "next/link";

export default function MonthlyResult({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = use(params);

  const data = [
    {
      date: "31/03/2026",
      values: [
        ["123", "6"],
        ["890", "7"],
        ["269", "7"],
        ["559", "9"],
        ["125", "8"],
        ["569", "0"],
        ["680", "4"],
        ["120", "3"],
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <LiveBar />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 pt-28 px-4 md:px-10">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-wide">
            {month.toUpperCase()} {year}
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Monthly Result Chart
          </p>

          <div className="mt-5">
            <Link
              href="/old-kolkata-ff-fatafat-result"
              className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* RESULT CARDS */}
        <div className="space-y-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/70 border border-white/40 shadow-xl rounded-2xl overflow-hidden"
            >
              {/* DATE HEADER */}
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-center py-3 text-lg font-semibold text-black">
                {item.date}
              </div>

              {/* VALUES GRID */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 p-3 md:p-4">
                {item.values.map((val, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center justify-center border"
                  >
                    <span className="text-xl md:text-2xl font-bold text-gray-800">
                      {val[0]}
                    </span>
                    <span className="text-sm text-yellow-600 font-semibold mt-1">
                      {val[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER SPACE */}
        <div className="h-10"></div>
      </div>
    </>
  );
}