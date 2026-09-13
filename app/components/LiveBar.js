"use client";

export default function LiveBar() {
  const marqueeItems = [
    "Sikkim Fatafat Result Today",
    "Fast & Latest Result Update",
    "Check Today's Result Now",
    "Daily Updated Result",
    "SikkimFatafat Live Update",
  ];

  return (
    <div className="mt-25 w-full px-3 sm:px-6">
      <div className="relative flex w-full items-center overflow-hidden rounded-full border border-sky-300/80 bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-blue-500/10 shadow-[0_4px_25px_rgba(56,189,248,0.25)] backdrop-blur-md dark:bg-slate-900/80">

        {/* ================= LIVE BADGE ================= */}
        <div className="relative z-20 flex shrink-0 items-center gap-2.5 rounded-r-full bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-3 shadow-[4px_0_15px_rgba(14,165,233,0.4)] sm:px-5">
          
          {/* Pulse */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-80" />

            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(165,243,252,0.8)]" />
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
          <div className="live-marquee-track flex w-max items-center py-3 text-sm font-semibold text-sky-950 dark:text-sky-100">

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

                  <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
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

                  <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ================= AUTO REFRESH ================= */}
        <div className="relative z-20 hidden shrink-0 items-center gap-2 border-l border-sky-200/60 px-5 py-3 dark:border-sky-800/50 sm:flex">
          
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
          </span>

          <span className="whitespace-nowrap text-xs font-black tracking-wider text-sky-700 dark:text-sky-300">
            AUTO-REFRESH
          </span>
        </div>
      </div>
    </div>
  );
}