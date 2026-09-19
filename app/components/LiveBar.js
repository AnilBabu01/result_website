"use client";

export default function LiveBar() {
  const marqueeItems = [
    "Sikkim Fatafat Live Result",
    "Today's Latest Result",
    "Fast Result Updates",
    "Check Sikkim FF Result",
    "Latest Fatafat Numbers",
    "Daily Result Updates",
    "Sikkim FF Result Live",
  ];

  return (
    <section className="mt-25 w-full px-3 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">

        {/* MAIN LIVE BAR */}
        <div className="relative flex min-h-[68px] overflow-hidden rounded-2xl border border-sky-200/80 bg-white shadow-[0_8px_30px_rgba(14,165,233,0.10)] dark:border-slate-800 dark:bg-slate-950">

          {/* LIVE BADGE */}
          <div className="relative z-20 flex shrink-0 items-center px-3 sm:px-5">
            <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 px-3 py-2.5 shadow-lg shadow-sky-500/20 sm:px-4">

              {/* Pulse */}
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-white/60" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
              </div>

              <div className="leading-none">
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/70">
                  Status
                </p>

                <p className="mt-1 text-xs font-black tracking-wider text-white">
                  LIVE
                </p>
              </div>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="my-4 w-px bg-sky-100 dark:bg-slate-800" />

          {/* MARQUEE */}
          <div className="relative min-w-0 flex-1 overflow-hidden">

            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-50/80 via-white to-cyan-50/80 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />

            {/* Left fade */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent dark:from-slate-950 sm:w-14" />

            {/* Right fade */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-cyan-50 to-transparent dark:from-slate-950 sm:w-14" />

            {/* Moving content */}
            <div className="live-marquee relative z-[1] flex h-full min-w-max items-center">

              {/* LOOP 1 */}
              <div className="flex items-center">
                {marqueeItems.map((item, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex shrink-0 items-center"
                  >
                    <span className="mx-4 whitespace-nowrap text-xs font-bold text-slate-600 dark:text-slate-300 sm:mx-6 sm:text-sm">
                      {item}
                    </span>

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-black text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      →
                    </span>
                  </div>
                ))}
              </div>

              {/* LOOP 2 */}
              <div
                className="flex items-center"
                aria-hidden="true"
              >
                {marqueeItems.map((item, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex shrink-0 items-center"
                  >
                    <span className="mx-4 whitespace-nowrap text-xs font-bold text-slate-600 dark:text-slate-300 sm:mx-6 sm:text-sm">
                      {item}
                    </span>

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-black text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DESKTOP STATUS */}
          <div className="relative z-20 hidden shrink-0 items-center border-l border-sky-100 bg-white/90 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90 md:flex">
            <div className="flex items-center gap-2.5">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-sky-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h5M20 20v-5h-5M5.64 18.36A9 9 0 0118.36 5.64M18.36 18.36A9 9 0 015.64 5.64"
                  />
                </svg>
              </div>

              <div className="leading-none">
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Updates
                </p>

                <p className="mt-1 whitespace-nowrap text-[11px] font-black text-sky-600 dark:text-sky-400">
                  ACTIVE NOW
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE STATUS */}
        <div className="mt-2 flex items-center justify-center gap-2 md:hidden">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
          </span>

          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Live Result Updates
          </span>
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        .live-marquee {
          animation: liveMarquee 32s linear infinite;
          will-change: transform;
        }

        .live-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes liveMarquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .live-marquee {
            animation-duration: 24s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .live-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}