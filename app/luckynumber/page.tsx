"use client";

import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import LiveBar from "../components/LiveBar";

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
    spinSound.current.play();
  }

  const randomIndex = Math.floor(Math.random() * numbers.length);

  const offset = 90; // pointer at top

  const targetAngle =
    360 * 5 +
    (360 -
      (randomIndex * segmentAngle +
        segmentAngle / 2 +
        offset));

  const newRotation = rotation + targetAngle;

  setRotation(newRotation);

  setTimeout(() => {
    // ✅ CALCULATE RESULT FROM FINAL ROTATION
    const normalizedRotation = newRotation % 360;

    const correctedAngle = (360 - normalizedRotation + offset) % 360;

    const index = Math.floor(correctedAngle / segmentAngle);

    setResult(numbers[index]);
    setSpinning(false);

    if (spinSound.current) spinSound.current.pause();

    if (stopSound.current) {
      stopSound.current.currentTime = 0;
      stopSound.current.play();
    }
  }, 4000);
};

  return (
    <>
      <Navbar />
      <LiveBar />

      {/* AUDIO */}
      <audio
        ref={spinSound}
        src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"
      />
      <audio
        ref={stopSound}
        src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"
      />

      <div className="min-h-screen px-3 py-6 text-white flex flex-col items-center">
        <h1 className="text-2xl font-bold text-yellow-400">
          KOLKATA FF LUCKY NUMBER
        </h1>

        <div className="relative flex flex-col items-center mt-6 bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-xl py-6 w-full max-w-md">

          {/* POINTER */}
          <div className="absolute top-75 z-20">
            <div className="w-0 h-0 
              border-l-[12px] 
              border-r-[12px] 
              border-b-[18px] 
              border-l-transparent border-r-transparent border-b-green-500"
            />
          </div>

          {/* WHEEL */}
          <div
            className="w-[300px] h-[300px] rounded-full border-[6px] border-yellow-400 shadow-xl bg-black"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 4s cubic-bezier(0.33, 1, 0.68, 1)",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {numbers.map((num, i) => {
                const startAngle = i * segmentAngle;
                const endAngle = startAngle + segmentAngle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);

                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const pathData = `
                  M 50 50
                  L ${x1} ${y1}
                  A 50 50 0 0 1 ${x2} ${y2}
                  Z
                `;

                const textAngle = startAngle + segmentAngle / 2;

                const textX =
                  50 + 30 * Math.cos((Math.PI * textAngle) / 180);
                const textY =
                  50 + 30 * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <g key={i}>
                    <path
                      d={pathData}
                      fill={i % 2 === 0 ? "#facc15" : "#f59e0b"}
                      stroke="#000"
                      strokeWidth="0.5"
                    />

                    <text
                      x={textX}
                      y={textY}
                      fill="#000"
                      fontSize="6"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {num}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* BUTTON */}
          <button
            onClick={spinWheel}
            disabled={spinning}
            className="mt-6 px-6 py-3 bg-yellow-400 text-black font-bold rounded-full shadow-lg hover:scale-105 transition disabled:opacity-50"
          >
            {spinning ? "Spinning..." : "🍀 SPIN NOW"}
          </button>

          {/* RESULT */}
          {result !== null && !spinning && (
            <div className="mt-5 text-xl font-bold text-green-400 animate-bounce">
              🎯 Lucky Number: {result}
            </div>
          )}
        </div>
      </div>
    </>
  );
}