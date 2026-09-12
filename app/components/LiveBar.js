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
      {/* Main Outer Container with Sky Blue Glow */}
      <div className="relative flex items-center overflow-hidden rounded-full border border-sky-300/80 bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-blue-500/10 backdrop-blur-md shadow-[0_4px_25px_rgba(56,189,248,0.25)] dark:bg-slate-900/80">
        
        {/* LIVE Badge (Dark Sky / Deep Blue Accent) */}
        <div className="relative z-20 flex shrink-0 items-center gap-2.5 rounded-r-full bg-gradient-to-r from-sky-600 to-blue-600 px-5 py-3 shadow-[4px_0_15px_rgba(14,165,233,0.4)]">
          
          {/* Pulsing Beacon Indicator */}
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-80"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_8px_rgba(165,243,252,0.8)]"></span>
          </span>

          <span className="text-xs font-black tracking-widest text-white uppercase drop-shadow">
            LIVE
          </span>
        </div>

        {/* Marquee Ticker Section */}
        <div className="relative min-w-0 flex-1 overflow-hidden">
          
          {/* Gradient Fade Overlays for Smooth Edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-sky-50/90 to-transparent dark:from-slate-900" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-sky-50/90 to-transparent dark:from-slate-900" />

          {/* Scrolling Content Block */}
          <div className="flex w-max animate-live-scroll items-center py-3 font-semibold text-sm text-sky-950 dark:text-sky-100 hover:[animation-play-state:paused]">
            
            {/* First Set */}
            {marqueeItems.map((item, index) => (
              <span key={`item-1-${index}`} className="flex items-center">
                <span className="mx-6 tracking-wide whitespace-nowrap">{item}</span>
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              </span>
            ))}

            {/* Duplicate Set for Seamless Loop */}
            {marqueeItems.map((item, index) => (
              <span key={`item-2-${index}`} className="flex items-center">
                <span className="mx-6 tracking-wide whitespace-nowrap">{item}</span>
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
              </span>
            ))}
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="hidden shrink-0 items-center gap-2 border-l border-sky-200/60 dark:border-sky-800/50 px-5 py-3 sm:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500"></span>
          </span>
          <span className="text-xs font-black tracking-wider text-sky-700 dark:text-sky-300">
            AUTO-REFRESH
          </span>
        </div>

      </div>
    </div>
  );
}