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
  FaArrowRight,
  FaHistory,
  FaBolt,
  FaExternalLinkAlt,
  FaExclamationTriangle,
  FaQuestionCircle,
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
  close_time?: string;
};

type ApiResponse = {
  data?: ResultItem[];
};

type TodayTableItem = {
  no: number;
  value: string;
  result: string;
  closeTime?: string;
};

type HistoryDataItem = {
  date: string;
  values: string[];
  results: string[];
  closeTimes: string[];
};

/* =========================================================
   CONSTANTS
========================================================= */

const RESULT_NAME = "bombaybazar FATAFAT";
const TOTAL_BAZI = 12;

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
  return `${day}.${month}.${year}`;
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
        closeTime: "-",
      }));
    }

    return todayResults.slice(0, TOTAL_BAZI).map((item, index) => ({
      no: index + 1,
      value: getValue(item.last_no),
      result: getValue(item.first_no),
      closeTime: item.close_time || "-",
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
          closeTimes: dayData.map((item) => item.close_time || "-"),
        };
      });
  }, [results, todayDate]);

  /* =======================================================
     GRID BOARD RENDERER
  ======================================================= */

  const renderGridBoard = (
    values: string[],
    resultsList: string[],
    closeTimes?: string[]
  ) => {
    return (
      <div className="w-full overflow-x-auto select-none">
        <div className="min-w-[640px] sm:min-w-full border-t border-indigo-100">
          {/* Header Rounds Indicator */}
          <div className="grid grid-cols-12 bg-indigo-600 text-white font-bold text-center text-xs sm:text-sm divide-x divide-indigo-500">
            {Array.from({ length: TOTAL_BAZI }, (_, i) => (
              <div key={`head-${i}`} className="py-2">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Dynamic Close Time Header Row */}
          <div className="grid grid-cols-12 bg-slate-100 border-b border-indigo-100 text-center text-[9px] sm:text-[10px] font-semibold text-slate-600 divide-x divide-slate-200">
            {Array.from({ length: TOTAL_BAZI }, (_, i) => {
              const time = closeTimes?.[i];
              return (
                <div
                  key={`time-header-${i}`}
                  className="py-1 px-0.5 leading-tight font-extrabold flex items-center justify-center min-h-[28px]"
                >
                  {time && time !== "-" ? (
                    <span className="text-indigo-700 whitespace-normal break-words">
                      {time}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Results Grid Content */}
          <div className="grid grid-cols-12 bg-white divide-x divide-slate-200">
            {Array.from({ length: TOTAL_BAZI }, (_, i) => {
              const val = values[i] || "***_*";
              const res = resultsList[i] || "*";
              const isValOff = val === "OFF" || val === "***_*";
              const isResOff = res === "OFF" || res === "*";

              return (
                <div
                  key={`cell-${i}`}
                  className="py-3 px-1 text-center flex flex-col items-center justify-center min-h-[72px] bg-gradient-to-b from-slate-50/50 to-white"
                >
                  <span
                    className={`text-xs sm:text-sm font-black tracking-tighter ${
                      isValOff
                        ? "text-indigo-400 font-normal"
                        : "text-indigo-600"
                    }`}
                  >
                    {val}
                  </span>
                  <span
                    className={`text-base sm:text-lg font-black mt-0.5 leading-none ${
                      isResOff ? "text-rose-400 font-normal" : "text-rose-600"
                    }`}
                  >
                    {res}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (resultLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-indigo-900">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <FaBolt className="absolute text-indigo-600 text-lg animate-pulse" />
        </div>
        <p className="mt-4 font-bold text-indigo-700 tracking-wider text-xs uppercase">
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-indigo-100 rounded-3xl p-8 text-center max-w-md w-full shadow-xl shadow-indigo-100/50">
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/30 active:scale-95 transition disabled:opacity-60"
          >
            <FaSyncAlt className={manualRefreshing ? "animate-spin" : ""} />
            {manualRefreshing ? "Retrying..." : "Retry Connection"}
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN LAYOUT
  ======================================================= */

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-purple-50/20 to-slate-50 text-slate-700 font-sans antialiased pb-16">
      {(manualRefreshing || resultFetching) && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 text-white px-4 py-2 text-xs font-bold shadow-md flex items-center justify-center gap-2 animate-pulse">
          <FaSyncAlt className="animate-spin text-white" />
          <span>Syncing real-time updates...</span>
        </div>
      )}

      {/* Hero Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 text-indigo-950 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
              <FaBolt className="text-yellow-300" />
            </div>
            <div>
              <h1 className="font-black tracking-wide text-indigo-900 text-base sm:text-lg leading-tight">
                bombaybazar FATAFAT
              </h1>
              <span className="text-[10px] font-extrabold tracking-widest text-indigo-500 uppercase block -mt-0.5">
                Official Live Portal
              </span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={manualRefreshing || resultFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-700 active:scale-95 transition disabled:opacity-50"
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

      <div className="max-w-md mx-auto px-3.5 pt-5 flex flex-col items-center">
        {/* =================================================
            LIVE / TODAY RESULT CARD
        ================================================= */}
        <section className="w-full bg-white border border-indigo-100 rounded-3xl overflow-hidden shadow-xl shadow-indigo-500/5 mb-5">
          <div className="p-4 bg-white flex items-center justify-between border-b border-slate-100">
            <h2 className="text-lg font-black text-indigo-950 tracking-tight">
              Today's Results
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500 text-white text-[11px] font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="py-4 flex justify-center bg-slate-50/60 border-b border-slate-100">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50/70 border border-indigo-100 text-xs font-black text-indigo-950 shadow-inner">
              <FaCalendarAlt className="text-indigo-500 text-xs" />
              <span>
                DATE: {todayDate ? formatHistoryDate(todayDate) : "LOADING..."}
              </span>
            </div>
          </div>

          {/* Grid Render */}
          {renderGridBoard(
            todayTableData.map((i) => i.value),
            todayTableData.map((i) => i.result),
            todayTableData.map((i) => i.closeTime || "-")
          )}

          {!hasTodayResult && (
            <div className="text-center py-2.5 bg-rose-50 border-t border-rose-100 text-rose-600 font-bold text-[11px] uppercase tracking-wider">
              Today's Draws are Currently Closed
            </div>
          )}

          <div className="p-3 bg-white">
            <button
              onClick={handleRefresh}
              disabled={manualRefreshing || resultFetching}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-indigo-500/20 border border-indigo-500 flex items-center justify-center gap-2 active:scale-[0.98] transition disabled:opacity-60 cursor-pointer"
            >
              <FaSyncAlt
                className={
                  manualRefreshing || resultFetching ? "animate-spin" : ""
                }
              />
              <span>
                {manualRefreshing || resultFetching
                  ? "FETCHING LATEST DRAW..."
                  : "REFRESH RESULTS"}
              </span>
            </button>
          </div>
        </section>

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
            PREVIOUS RESULTS HISTORY
        ================================================= */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaHistory className="text-indigo-600 text-sm" />
            <h2 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
              OLD RECORD PANEL
            </h2>
          </div>

          <div className="w-full space-y-4">
            {historyData.slice(0, visibleHistoryCount).map((history) => (
              <div
                key={history.date}
                className="w-full bg-white rounded-3xl border border-indigo-100 overflow-hidden shadow-sm"
              >
                <div className="py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-center font-black text-xs tracking-wider uppercase">
                  {history.date}
                </div>
                {renderGridBoard(
                  history.values,
                  history.results,
                  history.closeTimes
                )}
              </div>
            ))}
          </div>

          {visibleHistoryCount < historyData.length && (
            <button
              onClick={() => setVisibleHistoryCount((prev) => prev + 5)}
              className="mt-4 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-black text-xs py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span>LOAD PREVIOUS DATES</span>
              <FaChevronDown className="text-indigo-600" />
            </button>
          )}
        </div>

        {/* =================================================
            INFORMATION & NOTICE CARD
        ================================================= */}
        <section className="w-full bg-white border border-indigo-100 rounded-3xl p-5 space-y-4 text-slate-600 text-xs shadow-sm mb-6">
          <div>
            <h3 className="text-indigo-950 font-black text-sm mb-1 flex items-center gap-2">
              <FaInfoCircle className="text-indigo-600" />
              About Bombaybazar Fatafat
            </h3>
            <p className="leading-relaxed text-slate-500">
              Bombaybazar FF is a popular timing-based game. Results are
              recorded across 12 scheduled rounds daily.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <h4 className="text-indigo-950 font-bold mb-0.5 flex items-center gap-1.5 text-xs">
                <FaShieldAlt className="text-emerald-500" />
                Automated Synchronization
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Results update live as each Bazi completes throughout the day.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <h4 className="text-indigo-950 font-bold mb-0.5 flex items-center gap-1.5 text-xs">
                <FaLightbulb className="text-amber-500" />
                Fair Play Notice
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Draws are purely chance-based. Beware of unofficial agents or
                fraudulent claims online.
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            WHAT IS BOMBAYBAZAR FF ?
        ================================================= */}
        <section className="w-full bg-white border border-indigo-100 rounded-3xl p-5 space-y-4 text-slate-600 text-xs shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-indigo-950 font-black text-base flex items-center gap-2">
              <FaQuestionCircle className="text-indigo-600" />
              What is bombaybazar FF?
            </h3>
          </div>

          <div className="space-y-3 leading-relaxed text-slate-600">
            <p>
              bombaybazar ff sabse pahle This is the bombaybazar photo fort
              official ⭐⭐⭐ No# 1✅✅✅ website🌏 for all bombaybazar people
              who want to get fast bombaybazar ff fatafat result. Here you can
              see all today and previous all old and new results online free.
            </p>

            <h4 className="font-extrabold text-indigo-900 text-sm pt-2">
              Welcome to bombaybazar Fatafat Result
            </h4>
            <p>
              bombaybazar Fatafat Today Result ❤️ bombaybazar FF Result Sabse
              Pahle Yahi Par Aata Hai ❤️
            </p>

            <h4 className="font-extrabold text-indigo-900 text-sm pt-2">
              bombaybazar FF Tips for free
            </h4>
            <p>
              This game is completely based on luck and your own intellect. With
              the help of bombaybazar FF Old Results, you can make some
              estimates about the upcoming number.
            </p>

            <h4 className="font-extrabold text-indigo-900 text-sm pt-2">
              How to find bombaybazar FF Today Result
            </h4>
            <p>
              At first, you have to open this portal. Now on the home page of
              this portal find out your today game bazi. Then verify the number
              below that.
            </p>

            <h4 className="font-extrabold text-indigo-900 text-sm pt-2">
              bombaybazar FF Old Result
            </h4>
            <p>
              On the home page of this satta portal, you will find a large
              previous record table of the results. In this table, you will
              become able to find out bombaybazar FF Old Results of previous
              days.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}