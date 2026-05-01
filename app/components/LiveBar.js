"use client";

export default function LiveBar() {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 shadow-lg text-white flex items-center overflow-hidden mt-24">
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-700 font-bold whitespace-nowrap">
        LIVE <span className="blink text-lg">🔴</span>
      </div>

      <div className="overflow-hidden w-full">
        <div className="animate-scroll font-bold py-2">
          | Daily Updated Result Website | Kolkata FF Result Today | Fast Update
          | Check Now 🔥 |
        </div>
      </div>
    </div>
  );
}