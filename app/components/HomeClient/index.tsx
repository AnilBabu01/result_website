"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaSyncAlt,
  FaWhatsapp,
  FaTelegramPlane,
  FaDownload,
  FaCalendarAlt,
  FaChevronDown,
  FaShieldAlt,
  FaLightbulb,
  FaArrowRight,
  FaHistory,
  FaBolt,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaTrophy,
  FaSearch,
  FaChartLine,
  FaGlobe,
  FaClock,
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

type TimeTableSlot = {
  bazi: string;
  time: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const RESULT_NAME = "sikkimff FATAFAT";
const TOTAL_BAZI = 8; // Applied 8 Bazi limit

const TIME_TABLE: TimeTableSlot[] = [
  { bazi: "1 Bazi", time: "10:30 am" },
  { bazi: "2 Bazi", time: "12:00 pm" },
  { bazi: "3 Bazi", time: "01:30 pm" },
  { bazi: "4 Bazi", time: "03:00 pm" },
  { bazi: "5 Bazi", time: "04:30 pm" },
  { bazi: "6 Bazi", time: "06:00 pm" },
  { bazi: "7 Bazi", time: "07:30 pm" },
  { bazi: "8 Bazi", time: "09:00 pm" },
];

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

function normalizeResultDate(createdAt: string | null | undefined): string {
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

  console.log("rawResultData from home", rawResultData);

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
        month: "short",
        year: "numeric",
      });

      const dayName = now.toLocaleDateString("en-US", {
        weekday: "short",
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
     TODAY RESULTS (RESTRICTED TO 8 BAZI)
  ======================================================= */

  const todayResults = useMemo(() => {
    if (!todayDate) return [];
    return results
      .filter((item) => normalizeResultDate(item.created_at) === todayDate)
      .sort((a, b) => getBaziId(a) - getBaziId(b));
  }, [results, todayDate]);

  const hasTodayResult = useMemo(() => todayResults.length > 0, [todayResults]);

  const todayTableData: TodayTableItem[] = useMemo(() => {
    // if (!hasTodayResult) {
    //   return Array.from({ length: TOTAL_BAZI }, (_, index) => ({
    //     no: index + 1,
    //     value: "OFF",
    //     result: "OFF",
    //   }));
    // }

    return todayResults.slice(0, TOTAL_BAZI).map((item, index) => ({
      no: index + 1,
      value: getValue(item.last_no),
      result: getValue(item.first_no),
    }));
  }, [todayResults, hasTodayResult]);

  /* =======================================================
     HISTORY DATA (RESTRICTED TO 8 BAZI PER DAY)
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
          new Date(`${a}T00:00:00`).getTime(),
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
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center text-sky-900">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <FaBolt className="absolute text-sky-600 text-lg animate-pulse" />
        </div>
        <p className="mt-4 font-bold text-sky-700 tracking-wider text-xs uppercase">
          Loading Live Data...
        </p>
      </div>
    );
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  if (resultError) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
        <div className="bg-white border border-sky-100 rounded-3xl p-8 text-center max-w-md w-full shadow-xl shadow-sky-100/50">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-4 border border-red-100">
            <FaExclamationTriangle />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-1">
            Connection Lost
          </h2>
          <p className="text-slate-500 text-xs mb-6">
            Unable to fetch data from the server. Please check your internet
            connection.
          </p>
          <button
            onClick={handleRefresh}
            disabled={manualRefreshing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-500/30 active:scale-95 transition disabled:opacity-60"
          >
            <FaSyncAlt className={manualRefreshing ? "animate-spin" : ""} />
            {manualRefreshing ? "Retrying..." : "Retry Connection"}
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     GRID BOARD RENDERER (8 BAZI GRID SYSTEM)
  ======================================================= */

  const renderGridBoard = (values: string[], resultsList: string[]) => {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-full">
          {/* Header Rounds Indicator - 8 Columns */}
          <div className="grid grid-cols-8 bg-sky-100/80 border-b border-sky-200 text-[10px] sm:text-xs font-extrabold text-sky-800 text-center py-1.5">
            {Array.from({ length: TOTAL_BAZI }, (_, i) => (
              <div key={`head-${i}`}>BAZI-{i + 1}</div>
            ))}
          </div>

          {/* Values Row (Patti/Last No) */}
          <div className="grid grid-cols-8 w-full bg-white border-b border-sky-100">
            {Array.from({ length: TOTAL_BAZI }, (_, i) => {
              const val = values[i] || "-";
              const isOff = val === "OFF";
              return (
                <div
                  key={`val-${i}`}
                  className={`py-2 px-0.5 text-center text-[25px] sm:text-xs font-semibold border-r last:border-r-0 border-sky-100/60 ${
                    isOff ? "text-rose-500 font-bold" : "text-black"
                  }`}
                >
                  <p className="text-black text-[15px]">{val}</p>
                </div>
              );
            })}
          </div>

          {/* Results Row (Single/First No) */}
          <div className="grid grid-cols-8 w-full bg-sky-50/40">
            {Array.from({ length: TOTAL_BAZI }, (_, i) => {
              const res = resultsList[i] || "-";
              const isOff = res === "OFF";
              return (
                <div
                  key={`res-${i}`}
                  className={`py-2.5 px-0.5 text-center text-xs sm:text-sm font-black border-r last:border-r-0 border-sky-100/60 ${
                    isOff ? "text-rose-500" : "text-sky-950"
                  }`}
                >
                  <p>{res}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /* =======================================================
     MAIN LAYOUT
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-700 font-sans antialiased pb-16">
      {/* Top Bar Refresh Notification */}
      {(manualRefreshing || resultFetching) && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-sky-600 text-white px-4 py-2 text-xs font-bold shadow-md flex items-center justify-center gap-2 animate-pulse">
          <FaSyncAlt className="animate-spin text-white" />
          <span>Syncing real-time updates...</span>
        </div>
      )}

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/10 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-sm shadow-inner border border-white/20">
              <FaBolt className="text-yellow-300" />
            </div>
            <div>
              <h1 className="font-black tracking-wide text-white text-base sm:text-lg leading-tight">
                Sikkim Fatafat
              </h1>
              <span className="text-[10px] font-extrabold tracking-widest text-sky-100 uppercase block -mt-0.5">
                Fatafat Live (8 Bazi)
              </span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={manualRefreshing || resultFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white backdrop-blur-md active:scale-95 transition disabled:opacity-50"
          >
            <FaSyncAlt
              className={`${
                manualRefreshing || resultFetching ? "animate-spin" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-3.5 pt-4 flex flex-col items-center">
        {/* =================================================
            LIVE / TODAY RESULT CARD (8 BAZI)
        ================================================= */}
        <section className="w-full bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-xl shadow-sky-500/5 mb-4">
          {/* Card Banner Header */}
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-white"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider">
                Live Today Board (8 Bazi)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              <FaCalendarAlt className="text-sky-100" />
              <span>{date || "LOADING..."}</span>
            </div>
          </div>

          {/* Grid Render */}
          {renderGridBoard(
            todayTableData.map((i) => i.value),
            todayTableData.map((i) => i.result),
          )}

          {/* OFF Notice if no records */}
          {!hasTodayResult && (
            <div className="text-center py-2.5 bg-rose-50 border-t border-rose-100 text-rose-600 font-bold text-[11px] uppercase tracking-wider">
              Today's Draws are Currently Closed
            </div>
          )}
        </section>

        {/* Action Button: Quick Refresh */}
        <button
          onClick={handleRefresh}
          disabled={manualRefreshing || resultFetching}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-sky-500/25 border border-sky-400 flex items-center justify-center gap-2 mb-5 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
        >
          <FaSyncAlt
            className={manualRefreshing || resultFetching ? "animate-spin" : ""}
          />
          <span>
            {manualRefreshing || resultFetching
              ? "FETCHING LATEST DRAW..."
              : "REFRESH LIVE BOARD"}
          </span>
        </button>

        {/* =================================================
            SIKKIM FATAFAT TIME TABLE CARD
        ================================================= */}

        {/* =================================================
            COMMUNITY & DOWNLOAD CTA LINKS
        ================================================= */}
        <div className="w-full grid grid-cols-1 gap-2.5 mb-6">
          {apkUrl !== "#" && (
            <a
              href={apkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white text-base">
                  <FaDownload />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">
                    Official Mobile Application
                  </div>
                  <div className="text-xs font-black">Download Android APK</div>
                </div>
              </div>
              <FaExternalLinkAlt className="text-xs opacity-70 group-hover:translate-x-0.5 transition" />
            </a>
          )}

          {whatsappGroup !== "#" && (
            <a
              href={whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg">
                  <FaWhatsapp />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">
                    Instant Updates
                  </div>
                  <div className="text-xs font-black">
                    Join WhatsApp Community
                  </div>
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
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl p-3.5 flex items-center justify-between shadow-md transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white text-lg">
                  <FaTelegramPlane />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-sky-100 tracking-wider">
                    Official Feed
                  </div>
                  <div className="text-xs font-black">
                    Join Telegram Channel
                  </div>
                </div>
              </div>
              <FaArrowRight className="text-xs opacity-70 group-hover:translate-x-1 transition" />
            </a>
          )}
        </div>

        {/* =================================================
            PREVIOUS RESULTS HISTORY (8 BAZI)
        ================================================= */}
        <div className="w-full mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-sky-200/60 flex-1" />
            <h2 className="text-xs font-black text-sky-900 uppercase tracking-widest flex items-center gap-1.5">
              <FaHistory className="text-sky-500" />
              Past Draw History (8 Bazi)
            </h2>
            <div className="h-px bg-sky-200/60 flex-1" />
          </div>

          <div className="w-full space-y-3.5">
            {historyData.slice(0, visibleHistoryCount).map((history) => (
              <div
                key={history.date}
                className="w-full bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-sm"
              >
                <div className="bg-sky-100/60 px-3 py-2 text-center border-b border-sky-100 flex items-center justify-center gap-1.5">
                  <FaCalendarAlt className="text-sky-600 text-xs" />
                  <span className="text-xs font-extrabold text-sky-900 tracking-wider">
                    DATE: {history.date}
                  </span>
                </div>
                {renderGridBoard(history.values, history.results)}
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleHistoryCount < historyData.length && (
            <button
              onClick={() => setVisibleHistoryCount((prev) => prev + 5)}
              className="mt-4 w-full bg-sky-100/80 hover:bg-sky-200/70 text-sky-900 border border-sky-200/60 font-black text-xs py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span>LOAD PREVIOUS DATES</span>
              <FaChevronDown className="text-sky-600" />
            </button>
          )}
        </div>
        <section className="w-full bg-white border border-sky-500 rounded-2xl overflow-hidden shadow-md mb-6">
          <div className="bg-sky-500 px-4 py-3 text-slate-900 flex items-center justify-center gap-2">
            <FaClock className="text-white text-base" />
            <h3 className="font-black text-base uppercase tracking-wide text-amber-50">
              Sikkim result Time
            </h3>
          </div>
          <div className="divide-y divide-sky-500">
            {TIME_TABLE.map((slot) => (
              <div
                key={slot.bazi}
                className="flex items-center justify-between px-6 py-2.5 hover:bg-amber-50/50 transition-colors"
              >
                <span className="font-semibold text-slate-700 text-xs sm:text-sm">
                  {slot.bazi}
                </span>
                <span className="font-black text-slate-900 text-xs sm:text-sm">
                  {slot.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================
            sikkimFF INFORMATION SECTION (INTEGRATED)
        ================================================= */}
        <section className="w-full bg-white border border-sky-100 rounded-2xl p-5 space-y-5 text-slate-600 text-xs shadow-sm mb-6">
          {/* Header Banner */}
          <div className="border-b border-sky-100 pb-3">
            <h3 className="text-sky-950 font-black text-base sm:text-lg mb-1 flex items-center gap-2">
              <FaGlobe className="text-sky-500" />
              What is sikkimFF (Fatafat)?
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              This is the premier portal for fast sikkimFF Fatafat results.
              Access today’s live results alongside historical old charts online
              free of cost.
            </p>
          </div>

          {/* Welcome Highlight */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl p-3.5 text-center">
            <h4 className="font-extrabold text-sky-900 text-sm mb-1">
              Welcome to sikkimFatafat Result
            </h4>
            <p className="text-[11px] text-sky-700 font-medium">
              sikkimFatafat Today Result ❤️ sikkimFF Result Sabse Pahle Yahi Par
              Aata Hai ❤️ sikkim ❤️ sikkim Fatafat Chart Dekho ❤️ Patti Aur
              Single Ke Sath Chart ❤️
            </p>
          </div>

          {/* Detailed Content Grid */}
          <div className="space-y-4">
            {/* Overview & Gameplay */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-2xs">
              <h4 className="text-slate-800 font-black text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FaTrophy className="text-amber-500" />
                sikkimFF Result & Satta Game
              </h4>
              <p className="leading-relaxed text-slate-500 text-[11px]">
                Satta games are played across the country, with significant
                participation from sikkim government and nearby states. The game
                operates on guessing numbers where participants put forward an
                amount to win a prespecified reward. Correct guesses yield major
                payouts, whereas incorrect entries lose the invested amount.
                Results on this portal update **8 times a day (8 Bazi)**.
              </p>
            </div>

            {/* Free Tips Notice */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60">
              <h4 className="text-amber-900 font-bold text-xs mb-1 flex items-center gap-1.5">
                <FaLightbulb className="text-amber-600" />
                Free sikkimFF Tips & Fraud Warning
              </h4>
              <p className="leading-relaxed text-amber-800/90 text-[11px]">
                Many sources on social platforms promise guaranteed numbers for
                money. Note that no guaranteed trick exists; the game depends on
                individual calculation and luck. Reviewing **sikkimFF Old
                Results** can assist in forming numerical estimates. Avoid
                paying third parties for fake outcome predictions.
              </p>
            </div>

            {/* How to Find Results */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
              <h4 className="text-slate-900 font-bold text-xs mb-1.5 flex items-center gap-1.5">
                <FaSearch className="text-sky-600" />
                How to Check Today's sikkimFF Result
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 font-medium">
                <li>Open this live portal home page.</li>
                <li>Locate today’s active Bazi round (1 to 8).</li>
                <li>
                  Verify your number under the specific Bazi column to check
                  winning status.
                </li>
              </ol>
            </div>

            {/* Old Result & Online Accessibility */}
            <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100 space-y-2">
              <h4 className="text-sky-950 font-bold text-xs flex items-center gap-1.5">
                <FaChartLine className="text-sky-500" />
                Online Play & Previous Records
              </h4>
              <p className="leading-relaxed text-slate-500 text-[11px]">
                Historically played offline, modern developments allow players
                to follow calculations and track sikkim results via mobile
                devices and online interfaces. Our record table provides
                comprehensive multi-day historical charts for verification.
              </p>
            </div>
          </div>

          {/* Standard Information Notice */}
          <div className="border-t border-slate-100 pt-3 flex items-start gap-2 text-slate-400 text-[10px]">
            <FaShieldAlt className="text-slate-400 text-xs mt-0.5 shrink-0" />
            <p>
              Information provided is for tracking, historical records, and
              analytical purposes. Always play responsibly and check local
              regulations.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
