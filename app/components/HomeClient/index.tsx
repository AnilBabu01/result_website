"use client";

import { useEffect, useState, useMemo } from "react";
import {
  FaDownload,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";

import {
  useGetResult30DaysQuery,
  useGetAppDataQuery,
} from "../../redux/api/apiClient";

type ResultItem = {
  id?: number;
  bazi_id: number;
  created_at: string;
  first_no: string;
  last_no: string;
};

type ApiResponse = {
  data: ResultItem[];
};

type TodayTableItem = {
  no: number;
  value: string;
  result: string;
};

type HistoryDataItem = {
  date: string;
  values: string[];
  results: string[];
};

export default function Home() {
  const [date, setDate] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(2);

  /* ==========================================
     APP DATA
  ========================================== */

  const { data: appData } = useGetAppDataQuery({});

  /* ==========================================
     RESULT API
  ========================================== */

  const {
    data: rawResultData,
    isLoading: resultLoading,
    error: resultError,
  } = useGetResult30DaysQuery("KOLKATA FATAFAT") as {
    data?: ApiResponse;
    isLoading: boolean;
    error: unknown;
  };

  /* ==========================================
     DATE
  ========================================== */

  useEffect(() => {
    const today = new Date();

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    const formattedDate = today.toLocaleDateString(
      "en-GB",
      options
    );

    const dayName = today.toLocaleDateString("en-US", {
      weekday: "long",
    });

    setDate(
      `${dayName.toUpperCase()}, ${formattedDate.toUpperCase()}`
    );

    document.title = `Kolkata FF Result Today ${formattedDate}`;
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];

  const results: ResultItem[] = rawResultData?.data || [];

  /* ==========================================
     APP LINKS
  ========================================== */

  const apkUrl = appData?.data?.apk_url || "#";

  const whatsappGroup =
    appData?.data?.whatsaap_group ||
    "https://chat.whatsapp.com";

  const telegramChannel =
    appData?.data?.telegram_channel ||
    "https://web.telegram.org/k/";

  /* ==========================================
     TODAY DATA
  ========================================== */

  const todayTableData: TodayTableItem[] = useMemo(() => {
    return results
      .filter((item) => item.created_at === todayDate)
      .sort((a, b) => a.bazi_id - b.bazi_id)
      .map((item, index) => ({
        no: index + 1,

        value:
          item.last_no && item.last_no !== "XXX"
            ? item.last_no
            : "-",

        result:
          item.first_no && item.first_no !== "X"
            ? item.first_no
            : "-",
      }));
  }, [results, todayDate]);

  /* ==========================================
     HISTORY DATA
  ========================================== */

  const historyData: HistoryDataItem[] = useMemo(() => {
    const historyGrouped = results
      .filter((item) => item.created_at !== todayDate)
      .reduce<Record<string, ResultItem[]>>(
        (acc, item) => {
          if (!acc[item.created_at]) {
            acc[item.created_at] = [];
          }

          acc[item.created_at].push(item);

          return acc;
        },
        {}
      );

    return Object.keys(historyGrouped)
      .sort(
        (a, b) =>
          new Date(b).getTime() -
          new Date(a).getTime()
      )
      .map((dateStr) => {
        const dayData = historyGrouped[dateStr].sort(
          (a, b) => a.bazi_id - b.bazi_id
        );

        return {
          date: new Date(dateStr).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),

          values: dayData.map((item) =>
            item.last_no === "XXX"
              ? "-"
              : item.last_no
          ),

          results: dayData.map((item) =>
            item.first_no === "X"
              ? "-"
              : item.first_no
          ),
        };
      });
  }, [results, todayDate]);

  /* ==========================================
     LOADING
  ========================================== */

  if (resultLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
      </div>
    );
  }

  /* ==========================================
     ERROR
  ========================================== */

  if (resultError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-white">
        <p className="text-xl font-bold text-red-500">
          Failed to load data
        </p>

        <button
          onClick={() => location.reload()}
          className="mt-4 rounded-lg bg-yellow-400 px-4 py-2 font-bold text-black"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ==========================================
     UI
  ========================================== */

  return (
    <div className="min-h-screen text-white">

      <div className="max-w-6xl mx-auto px-3 pt-4 pb-10">

        {/* =====================================
            DATE HEADER
        ====================================== */}

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-center py-2 rounded-lg font-bold shadow-md">
          🔴 {date}
        </div>

        {/* =====================================
            TODAY RESULT
        ====================================== */}

        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-4 mt-4 rounded-xl shadow-lg">

          {todayTableData.length === 0 ? (

            <p className="text-center font-bold text-gray-300 py-4">
              No results available for today yet.
            </p>

          ) : (

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">

              {todayTableData.map((item) => (

                <div
                  key={item.no}
                  className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black p-4 text-center font-bold rounded-lg shadow hover:scale-105 transition"
                >

                  <p className="text-lg">
                    {item.value}
                  </p>

                  <p className="text-sm">
                    {item.result}
                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* =====================================
            REFRESH BUTTON
        ====================================== */}

        <button
          onClick={() => location.reload()}
          className="block mx-auto mt-5 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition"
        >
          🔄 Refresh
        </button>

        {/* =====================================
            SOCIAL + APP BUTTONS
        ====================================== */}

        <div className="flex flex-col items-center gap-3 mt-5">

          {/* =================================
              DOWNLOAD APP
          ================================== */}

          <a
            href={apkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gradient-to-r from-green-400 to-green-600 px-4 py-3 rounded-xl font-bold w-full max-w-md shadow-lg hover:scale-105 transition"
          >

            <img
              src="/images/kolkataff.png"
              alt="Kolkata FF App"
              className="w-10 h-10 rounded-full"
            />

            <div className="text-center flex-1 text-black">

              <p className="text-sm font-bold">
                DOWNLOAD APP
              </p>

              <p className="text-xs">
                Fast Result
              </p>

            </div>

            <FaDownload className="text-black text-lg" />

          </a>

          {/* =================================
              WHATSAPP GROUP
          ================================== */}

          <a
            href={whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gradient-to-r from-green-500 to-green-700 px-4 py-3 rounded-xl font-bold w-full max-w-md shadow-lg hover:scale-105 transition"
          >

            <FaWhatsapp className="text-white text-3xl" />

            <div className="text-center flex-1 text-white">

              <p className="text-sm font-bold">
                JOIN WHATSAPP GROUP
              </p>

              <p className="text-xs">
                Get Latest Updates
              </p>

            </div>

            <span className="text-white text-xl">
              →
            </span>

          </a>

          {/* =================================
              TELEGRAM CHANNEL
          ================================== */}

          <a
            href={telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-3 rounded-xl font-bold w-full max-w-md shadow-lg hover:scale-105 transition"
          >

            <FaTelegramPlane className="text-white text-3xl" />

            <div className="text-center flex-1 text-white">

              <p className="text-sm font-bold">
                JOIN TELEGRAM CHANNEL
              </p>

              <p className="text-xs">
                Latest Result Updates
              </p>

            </div>

            <span className="text-white text-xl">
              →
            </span>

          </a>

        </div>

        {/* =====================================
            HISTORICAL RESULTS
        ====================================== */}

        {historyData
          .slice(0, visibleHistoryCount)
          .map((history, idx) => (

            <div
              key={idx}
              className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-4 mt-4 rounded-xl shadow-lg"
            >

              <p className="text-yellow-400 font-bold mb-3 text-center sm:text-left">
                📅 {history.date}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">

                {history.values.map((val, i) => (

                  <div
                    key={i}
                    className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black p-4 text-center font-bold rounded-lg shadow"
                  >

                    <p className="text-lg">
                      {val}
                    </p>

                    <p className="text-sm">
                      {history.results[i]}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          ))}

        {/* =====================================
            LOAD MORE
        ====================================== */}

        {visibleHistoryCount < historyData.length && (

          <button
            onClick={() =>
              setVisibleHistoryCount(
                (prev) => prev + 5
              )
            }
            className="block mx-auto mt-6 bg-yellow-400 text-black px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition"
          >
            ⬇️ Load More
          </button>

        )}

        {/* =====================================
            SEO CONTENT
        ====================================== */}

        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-5 mt-6 rounded-xl leading-7 text-gray-300">

          <h1 className="text-xl font-bold text-yellow-400 mb-2">
            What is Kolkata FF?
          </h1>

          <p>
            Kolkata FF (Kolkata Fatafat) is a popular
            number-based guessing game played mainly
            in West Bengal. Users check live results
            daily.
          </p>

          <h2 className="text-lg font-bold text-yellow-400 mt-4">
            Kolkata FF Result Today
          </h2>

          <p>
            Results are updated multiple times daily.
            Players check after each round.
          </p>

          <h2 className="text-lg font-bold text-yellow-400 mt-4">
            Is Kolkata FF Legal?
          </h2>

          <p>
            It is illegal in many regions. We only
            provide informational data.
          </p>

          <h2 className="text-lg font-bold text-yellow-400 mt-4">
            Final Note
          </h2>

          <p>
            This is a luck-based game. Always play
            responsibly.
          </p>

        </div>

      </div>

    </div>
  );
}