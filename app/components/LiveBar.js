"use client";

export default function LiveBar() {
  return (
    <div className="mt-22 w-full px-3 sm:px-6 ">
      <div className="relative flex items-center overflow-hidden rounded-2xl border border-yellow-400/20 bg-gradient-to-r from-zinc-950 via-black to-zinc-950 shadow-[0_0_25px_rgba(250,204,21,0.12)]">

        {/* LIVE Badge */}
        <div className="relative z-10 flex shrink-0 items-center gap-2 rounded-r-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 font-black text-black shadow-[4px_0_15px_rgba(250,204,21,0.25)]">
          
          {/* Pulsing Dot */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
          </span>

          <span className="text-sm tracking-wider">
            LIVE
          </span>
        </div>

        {/* Moving Content */}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-black to-transparent" />

          <div className="flex w-max animate-live-scroll items-center py-3 font-bold text-sm text-yellow-100">

            <span className="mx-6">
              Sikkim FF Result Today
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Fast &amp; Latest Result Update
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Check Today's Result Now
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Daily Updated Result
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Sikkim Fatafat Live Update
            </span>

            {/* Duplicate for seamless loop */}
            <span className="mx-6">
              Sikkim FF Result Today
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Fast &amp; Latest Result Update
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Check Today's Result Now
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Daily Updated Result
            </span>

            <span className="text-yellow-500">◆</span>

            <span className="mx-6">
              Sikkim Fatafat Live Update
            </span>
          </div>
        </div>

        {/* Right Status */}
        <div className="hidden shrink-0 items-center gap-2 border-l border-yellow-400/20 px-4 py-3 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
          <span className="text-xs font-bold text-green-400">
            UPDATING
          </span>
        </div>
      </div>
    </div>
  );
}