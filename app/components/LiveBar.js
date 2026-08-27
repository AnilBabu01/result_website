"use client";

export default function LiveBar() {
  const tickerText =
    "Daily Updated Result Website • Kolkata FF Result Today • Fast Update • Check Now 🔥 • ";

  return (
    <div className="relative mt-16 w-full overflow-hidden rounded-xl border border-amber-500/20 bg-neutral-950/80 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.1)]">
      <div className="flex items-center">
        {/* Fixed Badge */}
        <div className="z-10 flex items-center gap-2 rounded-r-lg bg-gradient-to-r from-amber-600 to-yellow-500 px-4 py-2.5 font-extrabold text-xs uppercase tracking-wider text-black shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-700"></span>
          </span>
          Live Update
        </div>

        {/* Scrolling Content Container */}
        <div className="relative flex overflow-hidden py-2.5 text-sm font-medium text-neutral-200">
          <div className="flex shrink-0 animate-scroll items-center space-x-4 whitespace-nowrap font-semibold">
            <span>{tickerText}</span>
            <span>{tickerText}</span>
          </div>
          <div
            aria-hidden="true"
            className="flex shrink-0 animate-scroll items-center space-x-4 whitespace-nowrap font-semibold"
          >
            <span>{tickerText}</span>
            <span>{tickerText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}