"use client";

export default function LiveBar() {
  return (
    <div className="mt-22 w-full px-3 sm:px-6">
      <div className="relative flex items-center overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-r from-slate-50 via-white to-slate-50 shadow-[0_4px_20px_rgba(245,158,11,0.12)]">

        {/* LIVE Badge */}
        <div className="relative z-10 flex shrink-0 items-center gap-2 rounded-r-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 font-black text-white shadow-[4px_0_15px_rgba(245,158,11,0.3)]">
          
          {/* Pulsing Dot */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
          </span>

          <span className="text-sm tracking-wider">
            LIVE
          </span>
        </div>

        {/* Moving Content */}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent" />

          <div className="flex w-max animate-live-scroll items-center py-3 font-bold text-sm text-slate-800">

            <span className="mx-6">
              Sikkim FF Result Today
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Fast &amp; Latest Result Update
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Check Today's Result Now
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Daily Updated Result
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Sikkim Fatafat Live Update
            </span>

            {/* Duplicate for seamless loop */}
            <span className="mx-6">
              Sikkim FF Result Today
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Fast &amp; Latest Result Update
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Check Today's Result Now
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Daily Updated Result
            </span>

            <span className="text-amber-500">◆</span>

            <span className="mx-6">
              Sikkim Fatafat Live Update
            </span>
          </div>
        </div>

        {/* Right Status */}
        <div className="hidden shrink-0 items-center gap-2 border-l border-amber-200 px-4 py-3 sm:flex">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500"></span>
          <span className="text-xs font-extrabold tracking-wide text-emerald-600">
            UPDATING
          </span>
        </div>
      </div>
    </div>
  );
}