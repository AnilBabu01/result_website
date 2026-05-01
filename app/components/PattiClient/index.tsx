"use client";

export default function OldPage() {
  // Patti chart data (sample based on your image)
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

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Title Section */}
      <div className="text-center py-6 px-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          KOLKATA FF PATTI CHART LIST
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Use the comprehensive chart below to find three-digit Patti
          combinations for your Bazi predictions.
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex justify-center px-3 pb-10">
        <div className="border-4 border-yellow-400 bg-white rounded-lg overflow-hidden shadow-md">
          {/* Header Row */}
          <div className="grid grid-cols-10 bg-black text-white text-center font-bold">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, i) => (
              <div key={i} className="py-2 border border-gray-700">
                {num}
              </div>
            ))}
          </div>

          {/* Chart Rows */}
          {chart.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-10 text-center text-sm"
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4 text-sm">
        <div className="flex flex-wrap justify-center gap-4">
          <span>About Us</span>
          <span>Contact Us</span>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Disclaimer</span>
        </div>
      </footer>
    </div>
  );
}
