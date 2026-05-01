"use client";

import { useState } from "react";

export default function TipsPage() {
  const [selected, setSelected] = useState<number | null>(7);

  const numbers = Array.from({ length: 10 }, (_, i) => i);

  const voteData = [
    { num: 0, votes: 44, percent: 15.7 },
    { num: 1, votes: 40, percent: 14.2 },
    { num: 7, votes: 36, percent: 12.8 },
    { num: 4, votes: 30, percent: 10.7 },
    { num: 8, votes: 28, percent: 10.0 },
    { num: 6, votes: 26, percent: 9.3 },
    { num: 9, votes: 24, percent: 8.5 },
    { num: 3, votes: 19, percent: 6.8 },
    { num: 2, votes: 18, percent: 6.4 },
    { num: 5, votes: 16, percent: 5.7 },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-3 pt-4 pb-10">
        {/* ================= TIPS TABLE ================= */}
        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black p-3 font-bold text-center">
            <div>Tip of the Day</div>
            <div>02-Apr-2026</div>
          </div>

          {[
            { label: "1 Bazi", val: "0,2,4,6,8", status: false },
            { label: "2 Bazi", val: "9,8,2,1,5", status: true },
            { label: "3 Bazi", val: "5,1,8,0,3", status: false },
            { label: "4 Bazi", val: "6,1,2,5,9", status: false },
            { label: "5 Bazi", val: "3,1,6,8,2", status: true },
            { label: "6 Bazi", val: "6,8,3,4,9" },
          ].map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-t border-yellow-500/10 p-3 text-center"
            >
              <div>
                {item.label}{" "}
                {item.status !== undefined && (
                  <span>{item.status ? "✅" : "❌"}</span>
                )}
              </div>
              <div className="font-semibold text-yellow-400">{item.val}</div>
            </div>
          ))}
        </div>

        {/* ================= VOTING ================= */}
        <div className="text-center mt-8">
          <h2 className="text-yellow-400 font-bold text-xl">
            VOTE: BEST PREDICTION (0-9)
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => setSelected(num)}
                className={`w-12 h-12 rounded-full font-bold shadow transition
                ${
                  selected === num
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-green scale-110"
                    : "bg-white/10 text-black"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button className="mt-4 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black px-10 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition">
            VOTE CASTED
          </button>

          <p className="text-green-400 mt-2 text-sm">
            ✅ You have already voted.
          </p>
        </div>

        {/* ================= LIVE RESULTS ================= */}
        <div className="mt-6 bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-4 rounded-xl shadow-lg">
          <h2 className="text-yellow-400 font-bold text-center mb-4">
            LIVE VOTE RESULTS
          </h2>

          {voteData.map((item, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="bg-yellow-400 text-black px-2 rounded-full">
                  {item.num}
                </span>
                <span>{item.votes} Votes</span>
                <span>{item.percent}%</span>
              </div>

              <div className="w-full bg-white/10 h-2 rounded">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="mt-6 bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-5 rounded-xl leading-7 text-gray-300">
          <h2 className="text-yellow-400 font-bold text-lg mb-2">
            Kolkata FF Tips & Guide
          </h2>

          <p>
            Kolkata FF is a number-based guessing game. We provide daily tips
            based on analysis and trends. These tips are not guaranteed results.
          </p>

          <h3 className="text-yellow-400 font-bold mt-4">Play Responsibly</h3>

          <p>
            This is a luck-based game. Always play within limits and never
            depend on it as income.
          </p>
        </div>
      </div>
    </div>
  );
}
