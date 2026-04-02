"use client";

export default function LiveBar() {
  return (
    <div className="bg-red-500 text-white flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-red-600 font-bold whitespace-nowrap">
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
