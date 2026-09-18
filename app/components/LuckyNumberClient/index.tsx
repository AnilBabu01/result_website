"use client";

import { useRef, useState } from "react";

export default function LuckyWheel() {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const segmentAngle = 360 / numbers.length;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const spinSound = useRef<HTMLAudioElement | null>(null);
  const stopSound = useRef<HTMLAudioElement | null>(null);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    if (spinSound.current) {
      spinSound.current.currentTime = 0;
      spinSound.current.play().catch(() => {});
    }

    const randomIndex = Math.floor(Math.random() * numbers.length);

    // Pointer is positioned at the top.
    const offset = 90;

    const targetAngle =
      360 * 5 +
      (360 -
        (randomIndex * segmentAngle + segmentAngle / 2 + offset));

    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      const normalizedRotation =
        ((newRotation % 360) + 360) % 360;

      const correctedAngle =
        (360 - normalizedRotation + offset) % 360;

      const index =
        Math.floor(correctedAngle / segmentAngle) % numbers.length;

      setResult(numbers[index]);
      setSpinning(false);

      if (spinSound.current) {
        spinSound.current.pause();
        spinSound.current.currentTime = 0;
      }

      if (stopSound.current) {
        stopSound.current.currentTime = 0;
        stopSound.current.play().catch(() => {});
      }
    }, 4000);
  };

  return (
    <>
      {/* AUDIO */}
      <audio
        ref={spinSound}
        src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
        preload="auto"
      />

      <audio
        ref={stopSound}
        src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
        preload="auto"
      />

      <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-fuchsia-950 px-3 py-8 text-white">
        {/* Decorative background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center">
          {/* HEADER */}
          <div className="mb-6 text-center">
            <div className="mb-2 inline-flex items-center rounded-full border border-cyan-300/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-cyan-200 backdrop-blur-md">
              ✨ DAILY LUCKY GAME
            </div>

            <h1 className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              KOLKATA FF
            </h1>

            <p className="mt-1 text-sm font-medium text-purple-200">
              Lucky Number Wheel
            </p>
          </div>

          {/* CARD */}
          <section className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] px-4 py-7 shadow-2xl shadow-purple-950/50 backdrop-blur-xl sm:px-6">
            {/* Card glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

            {/* Wheel Area */}
            <div className="relative flex justify-center pt-5">
              {/* POINTER */}
              <div className="absolute -top-1 left-1/2 z-30 -translate-x-1/2">
                <div className="relative">
                  {/* Outer pointer */}
                  <div
                    className="
                      h-0 w-0
                      border-l-[17px]
                      border-r-[17px]
                      border-t-[28px]
                      border-l-transparent
                      border-r-transparent
                      border-t-fuchsia-500
                      drop-shadow-[0_4px_8px_rgba(217,70,239,0.6)]
                    "
                  />

                  {/* Pointer highlight */}
                  <div
                    className="
                      absolute left-1/2 top-[3px]
                      h-0 w-0
                      -translate-x-1/2
                      border-l-[8px]
                      border-r-[8px]
                      border-t-[13px]
                      border-l-transparent
                      border-r-transparent
                      border-t-pink-300
                    "
                  />
                </div>
              </div>

              {/* WHEEL OUTER RING */}
              <div
                className="
                  relative
                  rounded-full
                  border-[7px]
                  border-cyan-300
                  bg-gradient-to-br
                  from-cyan-400
                  via-purple-500
                  to-fuchsia-500
                  p-1
                  shadow-[0_0_35px_rgba(34,211,238,0.35)]
                "
              >
                {/* Wheel */}
                <div
                  className="h-[280px] w-[280px] overflow-hidden rounded-full border-4 border-purple-950/80 bg-purple-950 shadow-inner sm:h-[310px] sm:w-[310px]"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition:
                      "transform 4s cubic-bezier(0.33, 1, 0.68, 1)",
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full"
                  >
                    {numbers.map((num, i) => {
                      const startAngle = i * segmentAngle;
                      const endAngle =
                        startAngle + segmentAngle;

                      const x1 =
                        50 +
                        50 *
                          Math.cos(
                            (Math.PI * startAngle) / 180
                          );

                      const y1 =
                        50 +
                        50 *
                          Math.sin(
                            (Math.PI * startAngle) / 180
                          );

                      const x2 =
                        50 +
                        50 *
                          Math.cos(
                            (Math.PI * endAngle) / 180
                          );

                      const y2 =
                        50 +
                        50 *
                          Math.sin(
                            (Math.PI * endAngle) / 180
                          );

                      const pathData = `
                        M 50 50
                        L ${x1} ${y1}
                        A 50 50 0 0 1 ${x2} ${y2}
                        Z
                      `;

                      const textAngle =
                        startAngle + segmentAngle / 2;

                      const textX =
                        50 +
                        30 *
                          Math.cos(
                            (Math.PI * textAngle) / 180
                          );

                      const textY =
                        50 +
                        30 *
                          Math.sin(
                            (Math.PI * textAngle) / 180
                          );

                      const colors = [
                        "#22d3ee",
                        "#8b5cf6",
                        "#f472b6",
                        "#06b6d4",
                        "#a78bfa",
                        "#ec4899",
                        "#14b8a6",
                        "#6366f1",
                        "#d946ef",
                        "#0891b2",
                      ];

                      return (
                        <g key={i}>
                          <path
                            d={pathData}
                            fill={colors[i]}
                            stroke="#ffffff"
                            strokeOpacity="0.35"
                            strokeWidth="0.6"
                          />

                          <text
                            x={textX}
                            y={textY}
                            fill="#ffffff"
                            fontSize="6"
                            fontWeight="900"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{
                              filter:
                                "drop-shadow(0 1px 2px rgba(0,0,0,0.45))",
                            }}
                          >
                            {num}
                          </text>
                        </g>
                      );
                    })}

                    {/* Center circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="7"
                      fill="#ffffff"
                      opacity="0.95"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="4"
                      fill="#8b5cf6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={spinWheel}
                disabled={spinning}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-r
                  from-cyan-400
                  via-blue-500
                  to-fuchsia-500
                  px-9
                  py-3.5
                  text-sm
                  font-extrabold
                  tracking-wide
                  text-white
                  shadow-lg
                  shadow-purple-900/50
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-105
                  hover:shadow-cyan-500/30
                  active:scale-95
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <span className="relative z-10">
                  {spinning ? "🎡 SPINNING..." : "✨ SPIN NOW"}
                </span>

                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </div>

            {/* Result */}
            <div className="mt-6 min-h-[74px]">
              {result !== null && !spinning ? (
                <div className="animate-bounce text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    Your Lucky Number
                  </p>

                  <div className="mt-1 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-4xl font-black text-transparent">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-purple-200/70">
                  {spinning
                    ? "Good luck! The wheel is spinning..."
                    : "Tap the button to spin the wheel"}
                </div>
              )}
            </div>
          </section>

          {/* Bottom info */}
          <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-purple-200 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            Lucky Number • 0 to 9
          </div>
        </div>
      </main>
    </>
  );
}