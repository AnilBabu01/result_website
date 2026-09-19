"use client";

import React, { useRef, useState } from "react";
import { toPng, toBlob } from "html-to-image";

export default function OldPage() {
  // Patti chart data
  const chart = [
    ["100", "200", "300", "400", "500", "600", "700", "800", "900", "000"],
    ["678", "345", "120", "789", "456", "123", "890", "567", "234", "127"],
    ["777", "444", "111", "888", "555", "222", "999", "666", "333", "190"],
    ["560", "570", "580", "590", "140", "150", "160", "170", "180", "280"],
    ["470", "480", "490", "130", "230", "330", "340", "350", "360", "370"],
    ["380", "390", "670", "680", "690", "240", "250", "260", "270", "460"],
    ["290", "660", "238", "248", "258", "268", "278", "288", "450", "550"],
    ["119", "129", "139", "149", "159", "169", "179", "189", "199", "235"],
    ["137", "237", "337", "347", "357", "367", "377", "116", "117", "118"],
    ["236", "336", "157", "158", "799", "448", "467", "233", "469", "578"],
    ["146", "246", "346", "446", "267", "899", "115", "459", "126", "145"],
    ["669", "679", "689", "699", "780", "178", "124", "125", "667", "479"],
    ["579", "255", "355", "455", "447", "790", "223", "224", "478", "668"],
    ["399", "147", "247", "266", "366", "466", "566", "477", "135", "299"],
    ["588", "228", "256", "112", "113", "358", "557", "990", "225", "334"],
    ["489", "499", "166", "356", "122", "880", "368", "134", "144", "488"],
    ["245", "688", "599", "239", "177", "114", "359", "558", "379", "389"],
    ["155", "778", "148", "338", "249", "556", "449", "369", "559", "226"],
    ["227", "138", "788", "257", "339", "259", "269", "378", "289", "569"],
  ];

  const headers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const chartRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Download Chart Data as CSV File
  const handleDownloadCSV = () => {
    const csvRows = [];
    csvRows.push(headers.join(","));
    chart.forEach((row) => {
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SIKKIM_ff_patti_chart.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Download Chart DOM element as PNG Image
  const handleDownloadImage = async () => {
    if (!chartRef.current) return;
    try {
      setIsGenerating(true);
      const dataUrl = await toPng(chartRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "SIKKIM_ff_patti_chart.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Share Image via Web Share API (with link fallback)
  const handleShareImage = async () => {
    if (!chartRef.current) return;

    try {
      setIsGenerating(true);
      const blob = await toBlob(chartRef.current, { cacheBust: true, pixelRatio: 2 });
      
      if (!blob) throw new Error("Failed to create blob");

      const file = new File([blob], "SIKKIM_ff_patti_chart.png", { type: "image/png" });

      // Check if browser supports sharing actual image files
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "SIKKIM FF Patti Chart List",
          text: "Check out the SIKKIM FF Patti Chart List!",
          files: [file],
        });
      } else {
        // Fallback: Copy URL if image sharing isn't supported
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Error sharing image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Title Section */}
      <div className="text-center py-6 px-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          SIKKIM FF PATTI CHART LIST
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Use the comprehensive chart below to find three-digit Patti
          combinations for your Bazi predictions.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
          {/* Download CSV */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download CSV
          </button>

          {/* Download PNG Image */}
          <button
            onClick={handleDownloadImage}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium rounded-lg shadow transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {isGenerating ? "Generating Image..." : "Download Image"}
          </button>

          {/* Share Chart / Image */}
          <button
            onClick={handleShareImage}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            {copied ? "Link Copied!" : "Share Image"}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex justify-center px-3 pb-10">
        <div
          ref={chartRef}
          className="border-4 border-yellow-400 bg-white rounded-lg overflow-hidden shadow-md max-w-full overflow-x-auto"
        >
          {/* Header Row */}
          <div className="grid grid-cols-10 bg-black text-white text-center font-bold min-w-[320px]">
            {headers.map((num, i) => (
              <div key={i} className="py-2 border border-gray-700">
                {num}
              </div>
            ))}
          </div>

          {/* Chart Rows */}
          {chart.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-10 text-center text-sm min-w-[320px]"
            >
              {row.map((item, colIndex) => (
                <div key={colIndex} className="p-2 border border-red-300">
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}