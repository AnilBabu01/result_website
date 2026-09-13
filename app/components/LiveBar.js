"use client";

export default function LiveBar() {
  const marqueeItems = [
    "bombaybazar FF Result Today",
    "Fast & Latest Result Update",
    "Check Today's Result Now",
    "Daily Updated Result",
    "bombaybazar Fatafat Live Update",
  ];

  return (
    <div className="mt-25 w-full px-3 sm:px-6">
      <div className="relative flex w-full items-center overflow-hidden rounded-full border border-red-500/30 bg-gradient-to-r from-red-950/20 via-rose-900/10 to-amber-950/20 shadow-[0_4px_25px_rgba(239,68,68,0.2)] backdrop-blur-md dark:bg-slate-900/90">

        {/* ================= LIVE BADGE ================= */}
        <div className="relative z-20 flex shrink-0 items-center gap-2.5 rounded-r-full bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 shadow-[4px_0_15px_rgba(225,29,72,0.4)] sm:px-5">
          
          {/* Pulse */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-80" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
          </span>

          <span className="text-xs font-black uppercase tracking-widest text-white drop-shadow">
            LIVE
          </span>
        </div>

        {/* ================= MARQUEE ================= */}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 sm:w-16" />

          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80 sm:w-16" />

          {/* Moving track */}
          <div className="live-marquee-track flex w-max items-center py-3 text-sm font-semibold text-rose-950 dark:text-rose-100">

            {/* First copy */}
            <div className="flex shrink-0 items-center">
              {marqueeItems.map((item, index) => (
                <span
                  key={`first-${index}`}
                  className="flex shrink-0 items-center"
                >
                  <span className="mx-5 whitespace-nowrap tracking-wide sm:mx-6">
                    {item}
                  </span>

                  <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                </span>
              ))}
            </div>

            {/* Second copy - required for seamless loop */}
            <div
              className="flex shrink-0 items-center"
              aria-hidden="true"
            >
              {marqueeItems.map((item, index) => (
                <span
                  key={`second-${index}`}
                  className="flex shrink-0 items-center"
                >
                  <span className="mx-5 whitespace-nowrap tracking-wide sm:mx-6">
                    {item}
                  </span>

                  <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= AUTO REFRESH ================= */}
        <div className="relative z-20 hidden shrink-0 items-center gap-2 border-l border-red-200/60 px-5 py-3 dark:border-red-900/40 sm:flex">
          
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
          </span>

          <span className="whitespace-nowrap text-xs font-black tracking-wider text-rose-700 dark:text-rose-300">
            AUTO-REFRESH
          </span>
        </div>
      </div>
    </div>
  );
}