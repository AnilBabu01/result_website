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
    <section className="mt-25 w-full px-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-[0_8px_30px_rgba(14,165,233,0.12)] dark:border-slate-700 dark:bg-slate-950">

        {/* ================= LEFT STATUS ================= */}
        <div className="relative z-20 flex shrink-0 items-center gap-3 bg-slate-950 px-4 py-3 sm:px-6 dark:bg-sky-950">
          
          {/* Live Icon */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
          </div>

          <div className="leading-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
              Status
            </p>

            <p className="mt-1 text-sm font-black tracking-wider text-white">
              LIVE
            </p>
          </div>
        </div>

        {/* ================= TICKER ================= */}
        <div className="relative min-w-0 flex-1 overflow-hidden bg-gradient-to-r from-sky-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">

          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-sky-50 to-transparent dark:from-slate-900 sm:w-20" />

          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-cyan-50 to-transparent dark:from-slate-900 sm:w-20" />

          {/* Moving Content */}
          <div className="live-marquee-track flex min-w-max items-center py-3.5">

            {/* First set */}
            <div className="flex items-center">
              {marqueeItems.map((item, index) => (
                <div
                  key={`first-${index}`}
                  className="flex shrink-0 items-center"
                >
                  <span className="mx-5 whitespace-nowrap text-sm font-semibold text-slate-700 dark:text-slate-200 sm:mx-7">
                    {item}
                  </span>

                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.7)]" />
                </div>
              ))}
            </div>

            {/* Second set */}
            <div
              className="flex items-center"
              aria-hidden="true"
            >
              {marqueeItems.map((item, index) => (
                <div
                  key={`second-${index}`}
                  className="flex shrink-0 items-center"
                >
                  <span className="mx-5 whitespace-nowrap text-sm font-semibold text-slate-700 dark:text-slate-200 sm:mx-7">
                    {item}
                  </span>

                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.7)]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT UPDATE STATUS ================= */}
        <div className="relative z-20 hidden shrink-0 items-center gap-3 border-l border-sky-100 bg-white px-5 dark:border-slate-700 dark:bg-slate-950 sm:flex">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-500/10">
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
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Results
            </p>

            <p className="mt-1 whitespace-nowrap text-xs font-extrabold text-sky-600 dark:text-sky-400">
              AUTO UPDATED
            </p>
          </div>
        </div>
      </div>

      {/* ================= MOBILE UPDATE LABEL ================= */}
      <div className="mt-2 flex items-center justify-center gap-2 sm:hidden">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />

        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          Results Auto Updated
        </span>
      </div>

      {/* ================= MARQUEE ANIMATION ================= */}
      <style jsx>{`
        .live-marquee-track {
          animation: liveMarquee 28s linear infinite;
          will-change: transform;
        }

        .live-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes liveMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .live-marquee-track {
            animation-duration: 22s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .live-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}