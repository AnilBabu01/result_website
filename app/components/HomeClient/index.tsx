"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaSyncAlt,
  FaWhatsapp,
  FaTelegramPlane,
  FaDownload,
  FaCalendarAlt,
  FaChevronDown,
  FaInfoCircle,
  FaShieldAlt,
  FaLightbulb,
  FaCrown,
  FaArrowRight,
} from "react-icons/fa";

import {
  useGetResult30DaysQuery,
  useGetAppDataQuery,
} from "../../redux/api/apiClient";

/* =========================================================
   TYPES
========================================================= */

type ResultItem = {
  id?: number;
  bazi_id: number;
  created_at: string;
  first_no: string;
  last_no: string;
};

type ApiResponse = {
  data?: ResultItem[];
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

/* =========================================================
   CONSTANTS
========================================================= */

const RESULT_NAME = "bombaybazar FATAFAT";
const TOTAL_BAZI = 8;

/* =========================================================
   DATE HELPERS
========================================================= */

function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeResultDate(
  createdAt: string | null | undefined
): string {
  if (!createdAt) return "";
  const value = String(createdAt).trim();
  if (!value) return "";

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;

  const ddmmyyyy = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
}

function formatHistoryDate(dateString: string): string {
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function getBaziId(item: ResultItem): number {
  const id = Number(item.bazi_id);
  return Number.isFinite(id) ? id : 999999;
}

function getValue(value: string | null | undefined): string {
  if (!value) return "-";
  const cleanValue = String(value).trim();
  if (
    !cleanValue ||
    cleanValue.toUpperCase() === "XXX" ||
    cleanValue.toUpperCase() === "X"
  ) {
    return "-";
  }
  return cleanValue;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Home() {
  const [date, setDate] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(5);
  const [manualRefreshing, setManualRefreshing] = useState(false);

  /* =======================================================
     APP DATA & RESULT API
  ======================================================= */

  const { data: appData } = useGetAppDataQuery({});

  const {
    data: rawResultData,
    isLoading: resultLoading,
    isFetching: resultFetching,
    error: resultError,
    refetch,
  } = useGetResult30DaysQuery(RESULT_NAME, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  }) as {
    data?: ApiResponse | ResultItem[];
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
    refetch: () => Promise<any>;
  };

  /* =======================================================
     REFRESH BUTTON HANDLER
  ======================================================= */

  const handleRefresh = async () => {
    if (manualRefreshing) return;
    try {
      setManualRefreshing(true);
      await refetch();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setManualRefreshing(false);
    }
  };

  /* =======================================================
     DATE SYNC
  ======================================================= */

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const dayName = now.toLocaleDateString("en-US", {
        weekday: "long",
      });

      setDate(`${dayName.toUpperCase()}, ${formattedDate.toUpperCase()}`);
      setTodayDate(getLocalDateString());
      document.title = `${RESULT_NAME} Result Today ${formattedDate}`;
    };

    updateDate();
    const timer = window.setInterval(updateDate, 60000);
    return () => window.clearInterval(timer);
  }, []);

  /* =======================================================
     RAW RESULTS COMPUTATION
  ======================================================= */

  const results: ResultItem[] = useMemo(() => {
    if (!rawResultData) return [];
    if (Array.isArray(rawResultData)) return rawResultData;
    if (Array.isArray(rawResultData.data)) return rawResultData.data;
    return [];
  }, [rawResultData]);

  /* =======================================================
     APP LINKS
  ======================================================= */

  const apkUrl = appData?.data?.apk_url || "#";
  const whatsappGroup = appData?.data?.whatsaap_group || "#";
  const telegramChannel = appData?.data?.telegram_channel || "#";

  /* =======================================================
     TODAY RESULTS
  ======================================================= */

  const todayResults = useMemo(() => {
    if (!todayDate) return [];
    return results
      .filter((item) => normalizeResultDate(item.created_at) === todayDate)
      .sort((a, b) => getBaziId(a) - getBaziId(b));
  }, [results, todayDate]);

  const hasTodayResult = useMemo(() => todayResults.length > 0, [todayResults]);

  const todayTableData: TodayTableItem[] = useMemo(() => {
    if (!hasTodayResult) {
      return Array.from({ length: TOTAL_BAZI }, (_, index) => ({
        no: index + 1,
        value: "OFF",
        result: "OFF",
      }));
    }

    return todayResults.slice(0, TOTAL_BAZI).map((item, index) => ({
      no: index + 1,
      value: getValue(item.last_no),
      result: getValue(item.first_no),
    }));
  }, [todayResults, hasTodayResult]);

  /* =======================================================
     HISTORY DATA
  ======================================================= */

  const historyData: HistoryDataItem[] = useMemo(() => {
    const historyGrouped: Record<string, ResultItem[]> = {};

    results.forEach((item) => {
      const resultDate = normalizeResultDate(item.created_at);
      if (!resultDate || resultDate === todayDate) return;

      if (!historyGrouped[resultDate]) {
        historyGrouped[resultDate] = [];
      }
      historyGrouped[resultDate].push(item);
    });

    return Object.keys(historyGrouped)
      .sort(
        (a, b) =>
          new Date(`${b}T00:00:00`).getTime() -
          new Date(`${a}T00:00:00`).getTime()
      )
      .map((dateStr) => {
        const dayData = historyGrouped[dateStr]
          .sort((a, b) => getBaziId(a) - getBaziId(b))
          .slice(0, TOTAL_BAZI);

        return {
          date: formatHistoryDate(dateStr),
          values: dayData.map((item) => getValue(item.last_no)),
          results: dayData.map((item) => getValue(item.first_no)),
        };
      });
  }, [results, todayDate]);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (resultLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-800">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <FaCrown className="absolute text-amber-500 text-base animate-pulse" />
        </div>
        <p className="mt-4 font-bold text-gray-600 tracking-wider text-xs uppercase">
          Fetching Latest Results...
        </p>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (resultError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl mb-4 border border-red-200">
            ⚠️
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Unable to Fetch Data
          </h2>
          <p className="text-gray-500 text-xs mb-6">
            There was a network issue connecting to the live result server.
          </p>
          <button
            onClick={handleRefresh}
            disabled={manualRefreshing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-500 px-6 py-3 font-bold text-black shadow-sm active:scale-95 transition disabled:opacity-60"
          >
            <FaSyncAlt
              className={manualRefreshing ? "animate-spin" : ""}
            />
            {manualRefreshing ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     GRID BOARD RENDERER (FULL-SCREEN MOBILE FIXED)
  ======================================================= */

  const renderGridBoard = (values: string[], resultsList: string[]) => {
    return (
      <div className="w-full border-t border-gray-300">
        {/* Values Row (Patti/Last No) */}
        <div className="grid grid-cols-8 w-full bg-white border-b border-gray-300">
          {Array.from({ length: TOTAL_BAZI }, (_, i) => {
            const val = values[i] || "-";
            const isOff = val === "OFF";
            return (
              <div
                key={`val-${i}`}
                className={`py-2 px-0.5 text-center text-[10px] sm:text-xs font-bold border-r last:border-r-0 border-gray-300 ${
                  isOff ? "text-red-600 font-extrabold" : "text-gray-900"
                }`}
              >
                {val}
              </div>
            );
          })}
        </div>

        {/* Results Row (Single/First No) */}
        <div className="grid grid-cols-8 w-full bg-white">
          {Array.from({ length: TOTAL_BAZI }, (_, i) => {
            const res = resultsList[i] || "-";
            const isOff = res === "OFF";
            return (
              <div
                key={`res-${i}`}
                className={`py-2 px-0.5 text-center text-xs sm:text-sm font-black border-r last:border-r-0 border-gray-300 ${
                  isOff ? "text-red-600" : "text-gray-900"
                }`}
              >
                {res}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* =======================================================
     MAIN LAYOUT
  ======================================================= */

  return (
    <main className="min-h-screen bg-gray-100 text-gray-800 font-sans antialiased pb-16">
      {/* Top Bar Refresh Notification */}
      {(manualRefreshing || resultFetching) && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-400 text-black px-4 py-2 text-xs font-bold shadow-md flex items-center justify-center gap-2">
          <FaSyncAlt className="animate-spin text-black" />
          <span>Updating results from server...</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-black text-sm">
              FF
            </div>
            <h1 className="font-black tracking-wider text-gray-900 text-base sm:text-lg">
              bombaybazar <span className="text-amber-500">FATAFAT</span>
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={manualRefreshing || resultFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-bold text-gray-700 active:scale-95 transition disabled:opacity-50"
          >
            <FaSyncAlt
              className={`text-amber-600 ${
                manualRefreshing || resultFetching ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-3 pt-4 flex flex-col items-center">
        {/* =================================================
            LIVE / TODAY RESULT CARD
        ================================================= */}
        <section className="w-full bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm mb-4">
          {/* Card Banner */}
          <div className="bg-amber-400 border-b border-amber-500 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-black">
                Live Result Today
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-black">
              <FaCalendarAlt />
              <span>{date || "LOADING DATE..."}</span>
            </div>
          </div>

          {/* Grid Render */}
          {renderGridBoard(
            todayTableData.map((i) => i.value),
            todayTableData.map((i) => i.result)
          )}

          {/* OFF Notice if no records */}
          {!hasTodayResult && (
            <div className="text-center py-2 bg-red-50 border-t border-red-200 text-red-600 font-bold text-[11px] uppercase tracking-wider">
              Today's Bazi is Currently OFF
            </div>
          )}
        </section>

        {/* Action Button: Refresh */}
        <button
          onClick={handleRefresh}
          disabled={manualRefreshing || resultFetching}
          className="w-full bg-amber-400 hover:bg-amber-300 text-black font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm border border-amber-500 flex items-center justify-center gap-2 mb-6 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
        >
          <FaSyncAlt
            className={manualRefreshing || resultFetching ? "animate-spin" : ""}
          />
          <span>
            {manualRefreshing || resultFetching
              ? "REFRESHING DATA..."
              : "REFRESH RESULT"}
          </span>
        </button>

        {/* =================================================
            CTA LINKS
        ================================================= */}
        <div className="w-full space-y-2.5 mb-8">
          {apkUrl !== "#" && (
            <a
              href={apkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-red-700 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm">
                  <FaDownload />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-red-100 tracking-wider">
                    Official App
                  </div>
                  <div className="text-xs font-black">Download APK</div>
                </div>
              </div>
              <FaArrowRight className="text-xs opacity-70 group-hover:translate-x-1 transition" />
            </a>
          )}

          {whatsappGroup !== "#" && (
            <a
              href={whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-emerald-700 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-base">
                  <FaWhatsapp />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-emerald-100 tracking-wider">
                    Community
                  </div>
                  <div className="text-xs font-black">WhatsApp Group</div>
                </div>
              </div>
              <FaArrowRight className="text-xs opacity-70 group-hover:translate-x-1 transition" />
            </a>
          )}

          {telegramChannel !== "#" && (
            <a
              href={telegramChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-sky-600 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-base">
                  <FaTelegramPlane />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-sky-100 tracking-wider">
                    Channel
                  </div>
                  <div className="text-xs font-black">Telegram Join</div>
                </div>
              </div>
              <FaArrowRight className="text-xs opacity-70 group-hover:translate-x-1 transition" />
            </a>
          )}
        </div>

        {/* =================================================
            PREVIOUS RESULTS SECTION
        ================================================= */}
        <div className="w-full mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-gray-300 flex-1" />
            <h2 className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
              <FaCalendarAlt className="text-amber-500" />
              Old Results History
            </h2>
            <div className="h-px bg-gray-300 flex-1" />
          </div>

          <div className="w-full space-y-4">
            {historyData.slice(0, visibleHistoryCount).map((history) => (
              <div
                key={history.date}
                className="w-full bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm"
              >
                <div className="bg-amber-400 px-3 py-2 text-center border-b border-amber-500 flex items-center justify-center">
                  <span className="text-xs font-black text-black uppercase tracking-wider">
                    DATE: {history.date}
                  </span>
                </div>
                {renderGridBoard(history.values, history.results)}
              </div>
            ))}
          </div>

          {/* Load More Trigger */}
          {visibleHistoryCount < historyData.length && (
            <button
              onClick={() => setVisibleHistoryCount((prev) => prev + 5)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Load More Results</span>
              <FaChevronDown className="text-amber-600" />
            </button>
          )}
        </div>

        {/* =================================================
            INFORMATION & SEO SECTION
        ================================================= */}
        <section className="w-full bg-white border border-gray-300 rounded-xl p-4 space-y-4 text-gray-600 text-xs leading-relaxed">
          <div>
            <h3 className="text-gray-900 font-extrabold text-sm mb-1 flex items-center gap-2">
              <FaInfoCircle className="text-amber-500" />
              What is bombaybazar FF?
            </h3>
            <p>
              bombaybazar FF (Fatafat) is a popular timing-based number game played in West Bengal. Results are updated multiple times a day across 8 scheduled rounds (Bazi).
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="text-gray-900 font-bold mb-1 flex items-center gap-2">
                <FaShieldAlt className="text-emerald-600" />
                Live Result Timings
              </h4>
              <p className="text-[11px] text-gray-500">
                The game operates 8 times daily from morning to evening. Live results are updated automatically on this portal.
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="text-gray-900 font-bold mb-1 flex items-center gap-2">
                <FaLightbulb className="text-amber-500" />
                Free Number Tips Notice
              </h4>
              <p className="text-[11px] text-gray-500">
                This game relies entirely on luck and random draws. Avoid fraudulent channels on social media claiming fixed numbers.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}