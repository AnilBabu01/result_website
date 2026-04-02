"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import LiveBar from "../components/LiveBar";

export default function LuckyWheel() {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const segmentAngle = 360 / numbers.length;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * numbers.length);

    const stopAngle =
      360 - (randomIndex * segmentAngle + segmentAngle / 2);

    const extraSpins = 360 * 5;
    const newRotation = rotation + extraSpins + stopAngle;

    setRotation(newRotation);

    setTimeout(() => {
      const normalized = newRotation % 360;

      const index =
        Math.floor((360 - normalized) / segmentAngle) %
        numbers.length;

      setResult(numbers[index]);
      setSpinning(false);
    }, 4000);
  };

  return (
    <>
      <Navbar />
      <LiveBar />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 px-3 sm:px-4 md:px-6 py-6">
        
        {/* TITLE */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">
          KOLKATA FF LUCKY NUMBER
        </h1>

        <p className="text-gray-600 text-sm sm:text-base text-center mb-6">
          Spin the wheel to get your lucky number!
        </p>

        {/* WHEEL CONTAINER */}
        <div className="relative flex items-center justify-center">
          
          {/* POINTER */}
          <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 
              border-l-[10px] sm:border-l-[14px] 
              border-r-[10px] sm:border-r-[14px] 
              border-b-[16px] sm:border-b-[20px] 
              border-l-transparent border-r-transparent border-b-red-500 drop-shadow-md"
            />
          </div>

          {/* WHEEL */}
          <div
            className="
              w-[260px] h-[260px]
              sm:w-[300px] sm:h-[300px]
              md:w-[360px] md:h-[360px]
              lg:w-[420px] lg:h-[420px]
              rounded-full border-[6px] border-yellow-400 
              shadow-xl bg-white
            "
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
                    {/* SEGMENT */}
                    <path
                      d={pathData}
                      fill={i % 2 === 0 ? "#facc15" : "#f87171"}
                      stroke="#fff"
                      strokeWidth="0.5"
                    />

                    {/* NUMBER */}
                    <text
                      x={textX}
                      y={textY}
                      fill="#000"
                      fontSize="6"
                      className="sm:text-[7px] md:text-[8px]"
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
        </div>

        {/* BUTTON */}
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="
            mt-8
            px-5 py-2.5 sm:px-6 sm:py-3
            text-sm sm:text-base
            bg-yellow-400 hover:bg-yellow-500
            rounded-lg font-bold shadow-md
            active:scale-95 transition-all duration-150
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {spinning ? "Spinning..." : "🍀 SPIN NOW"}
        </button>

        {/* RESULT */}
        {result !== null && !spinning && (
          <div className="mt-6 text-lg sm:text-xl md:text-2xl font-bold text-green-600 text-center">
            🎯 Lucky Number: {result}
          </div>
        )}
      </div>
    </>
  );
}