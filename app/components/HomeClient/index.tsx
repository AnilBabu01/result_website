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

const RESULT_NAME = "sikkimff FATAFAT";
const TOTAL_BAZI = 8;

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

function getLocalDateString(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function normalizeResultDate(createdAt: string | null | undefined): string {
  if (!createdAt) return "";

  const value = String(createdAt).trim();
  if (!value) return "";

  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const ddmmyyyy = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);
  if (ddmmyyyy) {
    return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return [
      parsed.getFullYear(),
      String(parsed.getMonth() + 1).padStart(2, "0"),
      String(parsed.getDate()).padStart(2, "0"),
    ].join("-");
  }

  return "";
}

function formatHistoryDate(dateString: string): string {
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
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

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-100/70 text-teal-700">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-teal-950">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[11px] font-bold text-teal-600/80">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [date, setDate] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(5);
  const [manualRefreshing, setManualRefreshing] = useState(false);

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
    refetch: () => Promise<unknown>;
  };

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

  const results: ResultItem[] = useMemo(() => {
    if (!rawResultData) return [];
    if (Array.isArray(rawResultData)) return rawResultData;
    if (Array.isArray(rawResultData.data)) return rawResultData.data;
    return [];
  }, [rawResultData]);

  const apkUrl = appData?.data?.apk_url || "#";
  const whatsappGroup = appData?.data?.whatsaap_group || "#";
  const telegramChannel = appData?.data?.telegram_channel || "#";

  const todayResults = useMemo(() => {
    if (!todayDate) return [];

    return results
      .filter((item) => normalizeResultDate(item.created_at) === todayDate)
      .sort((a, b) => getBaziId(a) - getBaziId(b))
      .slice(0, TOTAL_BAZI);
  }, [results, todayDate]);

  const hasTodayResult = todayResults.length > 0;

  const todayTableData: TodayTableItem[] = useMemo(
    () =>
      todayResults.map((item, index) => ({
        no: index + 1,
        value: getValue(item.last_no),
        result: getValue(item.first_no),
      })),
    [todayResults]
  );

  const historyData: HistoryDataItem[] = useMemo(() => {
    const grouped: Record<string, ResultItem[]> = {};

    results.forEach((item) => {
      const resultDate = normalizeResultDate(item.created_at);

      if (!resultDate || resultDate === todayDate) return;

      if (!grouped[resultDate]) grouped[resultDate] = [];
      grouped[resultDate].push(item);
    });

    return Object.keys(grouped)
      .sort(
        (a, b) =>
          new Date(`${b}T00:00:00`).getTime() -
          new Date(`${a}T00:00:00`).getTime()
      )
      .map((dateStr) => {
        const dayData = grouped[dateStr]
          .sort((a, b) => getBaziId(a) - getBaziId(b))
          .slice(0, TOTAL_BAZI);

        return {
          date: formatHistoryDate(dateStr),
          values: dayData.map((item) => getValue(item.last_no)),
          results: dayData.map((item) => getValue(item.first_no)),
        };
      });
  }, [results, todayDate]);

  const renderGridBoard = (
    values: string[],
    resultsList: string[],
    compact = false
  ) => (
    <div className="overflow-x-auto">
      <div className="min-w-[620px]">
        <div className="grid grid-cols-8 border-b border-teal-100/60 bg-teal-50/50">
          {Array.from({ length: TOTAL_BAZI }, (_, i) => (
            <div
              key={`head-${i}`}
              className="border-r border-teal-100/60 px-1 py-2 text-center text-[9px] font-black uppercase tracking-wider text-teal-700 last:border-r-0 sm:text-[10px]"
            >
              Bazi {i + 1}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8 border-b border-teal-100/60 bg-white">
          {Array.from({ length: TOTAL_BAZI }, (_, i) => {
            const val = values[i] || "-";
            return (
              <div
                key={`value-${i}`}
                className="border-r border-teal-100/60 px-1 py-3 text-center last:border-r-0"
              >
                <span
                  className={`font-black ${
                    compact
                      ? "text-base sm:text-lg"
                      : "text-lg sm:text-xl"
                  } ${
                    val === "OFF" ? "text-rose-500" : "text-teal-950"
                  }`}
                >
                  {val}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-8 bg-gradient-to-b from-white to-sky-50/60">
          {Array.from({ length: TOTAL_BAZI }, (_, i) => {
            const result = resultsList[i] || "-";
            return (
              <div
                key={`result-${i}`}
                className="border-r border-teal-100/60 px-1 py-3 text-center last:border-r-0"
              >
                <span
                  className={`font-black ${
                    compact
                      ? "text-base sm:text-lg"
                      : "text-xl sm:text-2xl"
                  } ${
                    result === "OFF" ? "text-rose-500" : "text-sky-700"
                  }`}
                >
                  {result}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (resultLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-teal-50/30 px-5">
        <div className="w-full max-w-sm rounded-[2rem] border border-teal-100 bg-white p-8 text-center shadow-xl shadow-teal-100/50">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-50">
            <div className="absolute h-14 w-14 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
            <FaBolt className="text-teal-600 text-xl" />
          </div>
          <h2 className="mt-5 text-lg font-black text-teal-950">
            Loading Live Results
          </h2>
          <p className="mt-1 text-xs font-bold text-teal-600/70">
            Connecting to the latest result data...
          </p>
        </div>
      </main>
    );
  }

  if (resultError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-teal-50/30 px-5">
        <div className="w-full max-w-md rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-100/40">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </div>

          <h2 className="mt-5 text-xl font-black text-teal-950">
            Connection Problem
          </h2>

          <p className="mt-2 text-xs font-bold leading-5 text-teal-700/70">
            We could not fetch the latest result data. Please try again.
          </p>

          <button
            onClick={handleRefresh}
            disabled={manualRefreshing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-teal-200 transition hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60"
          >
            <FaSyncAlt className={manualRefreshing ? "animate-spin" : ""} />
            {manualRefreshing ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0fdfa] font-sans text-teal-900 antialiased">
      {(manualRefreshing || resultFetching) && (
        <div className="fixed left-0 right-0 top-0 z-[100] bg-teal-700 px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
          <span className="inline-flex items-center gap-2">
            <FaSyncAlt className="animate-spin" />
            Updating live results...
          </span>
        </div>
      )}

      <header className="relative overflow-hidden bg-white">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-teal-100/60 blur-2xl" />
        <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-cyan-100/60 blur-2xl" />

        <div className="relative mx-auto max-w-2xl px-4 pb-5 pt-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-200">
                <FaBolt className="text-lg" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black tracking-tight text-teal-950 sm:text-xl">
                    Sikkim Fatafat
                  </h1>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-600">
                    Live
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                  Today Result • 8 Bazi
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={manualRefreshing || resultFetching}
              aria-label="Refresh results"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50/50 text-teal-700 transition hover:bg-teal-100/60 active:scale-95 disabled:opacity-50 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5"
            >
              <FaSyncAlt
                className={
                  manualRefreshing || resultFetching ? "animate-spin" : ""
                }
              />
              <span className="ml-2 hidden text-xs font-black sm:inline">
                Refresh
              </span>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-teal-50/80 p-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-teal-500">
                Status
              </p>
              <p className="mt-1 text-xs font-black text-teal-900">
                {hasTodayResult ? "Live Data" : "Waiting"}
              </p>
            </div>
            <div className="rounded-2xl bg-cyan-50/80 p-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-cyan-600">
                Rounds
              </p>
              <p className="mt-1 text-xs font-black text-cyan-900">8 Bazi</p>
            </div>
            <div className="rounded-2xl bg-emerald-50/80 p-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600">
                Updates
              </p>
              <p className="mt-1 text-xs font-black text-emerald-900">60 sec</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-5 px-3 pb-14 pt-4 sm:px-6">
        <section className="overflow-hidden rounded-[1.7rem] border border-teal-100 bg-white shadow-xl shadow-teal-900/5">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-4 text-white sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 ring-4 ring-white/20" />
                  <p className="text-xs font-black uppercase tracking-wider">
                    Today Live Board
                  </p>
                </div>
                <p className="mt-1 text-[10px] font-medium text-teal-100">
                  Sikkim Fatafat • {TOTAL_BAZI} rounds
                </p>
              </div>

              <div className="rounded-xl bg-white/15 px-3 py-2 text-right backdrop-blur">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-teal-100">
                  <FaCalendarAlt />
                  Date
                </div>
                <p className="mt-0.5 text-[10px] font-black text-white">
                  {date || "LOADING..."}
                </p>
              </div>
            </div>
          </div>

          {renderGridBoard(
            todayTableData.map((item) => item.value),
            todayTableData.map((item) => item.result)
          )}

          {!hasTodayResult && (
            <div className="flex items-center justify-center gap-2 border-t border-rose-100 bg-rose-50 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-rose-600">
              <FaClock />
              Today&apos;s draws are currently closed
            </div>
          )}
        </section>

        <button
          onClick={handleRefresh}
          disabled={manualRefreshing || resultFetching}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-teal-200 transition hover:bg-teal-700 active:scale-[0.99] disabled:opacity-60"
        >
          <FaSyncAlt
            className={manualRefreshing || resultFetching ? "animate-spin" : ""}
          />
          {manualRefreshing || resultFetching
            ? "Fetching Latest Draw"
            : "Refresh Live Board"}
        </button>

        <section>
          <SectionTitle
            icon={<FaClock />}
            title="Sikkim Result Time"
            subtitle="Scheduled timing for all 8 Bazi rounds"
          />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_TABLE.map((slot, index) => (
              <div
                key={slot.bazi}
                className="group rounded-2xl border border-teal-100/70 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-50 text-[9px] font-black text-teal-700">
                    {index + 1}
                  </span>
                  <FaClock className="text-[10px] text-teal-300" />
                </div>
                <p className="mt-2 text-[10px] font-bold text-teal-600/70">
                  {slot.bazi}
                </p>
                <p className="mt-0.5 text-xs font-black text-teal-950">
                  {slot.time}
                </p>
              </div>
            ))}
          </div>
        </section>

        {(apkUrl !== "#" ||
          whatsappGroup !== "#" ||
          telegramChannel !== "#") && (
          <section>
            <SectionTitle
              icon={<FaArrowRight />}
              title="Quick Links"
              subtitle="Stay connected and get updates"
            />

            <div className="grid gap-2.5 sm:grid-cols-3">
              {apkUrl !== "#" && (
                <a
                  href={apkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 p-4 text-white shadow-lg shadow-teal-100 transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                      <FaDownload />
                    </div>
                    <FaExternalLinkAlt className="text-[9px] opacity-70" />
                  </div>
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-teal-100">
                    Official App
                  </p>
                  <p className="mt-1 text-xs font-black">Download APK</p>
                </a>
              )}

              {whatsappGroup !== "#" && (
                <a
                  href={whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-4 text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">
                      <FaWhatsapp />
                    </div>
                    <FaArrowRight className="text-[9px] opacity-70" />
                  </div>
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                    Instant Updates
                  </p>
                  <p className="mt-1 text-xs font-black">WhatsApp Group</p>
                </a>
              )}

              {telegramChannel !== "#" && (
                <a
                  href={telegramChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-700 p-4 text-white shadow-lg shadow-cyan-100 transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg">
                      <FaTelegramPlane />
                    </div>
                    <FaArrowRight className="text-[9px] opacity-70" />
                  </div>
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-cyan-100">
                    Official Feed
                  </p>
                  <p className="mt-1 text-xs font-black">Telegram Channel</p>
                </a>
              )}
            </div>
          </section>
        )}

        <section>
          <SectionTitle
            icon={<FaHistory />}
            title="Past Draw History"
            subtitle="Previous result charts • 8 Bazi per day"
          />

          <div className="space-y-3">
            {historyData.slice(0, visibleHistoryCount).map((history) => (
              <article
                key={history.date}
                className="overflow-hidden rounded-[1.5rem] border border-teal-100/80 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-teal-100/60 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                      <FaCalendarAlt className="text-xs" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-teal-500">
                        Previous Date
                      </p>
                      <p className="text-xs font-black text-teal-950">
                        {history.date}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-black text-teal-700 shadow-sm">
                    8 BAZI
                  </span>
                </div>

                {renderGridBoard(
                  history.values,
                  history.results,
                  true
                )}
              </article>
            ))}

            {historyData.length === 0 && (
              <div className="rounded-2xl border border-teal-100 bg-white p-6 text-center">
                <FaHistory className="mx-auto text-teal-200 text-2xl" />
                <p className="mt-2 text-xs font-bold text-teal-600/60">
                  No previous result history available.
                </p>
              </div>
            )}
          </div>

          {visibleHistoryCount < historyData.length && (
            <button
              onClick={() => setVisibleHistoryCount((prev) => prev + 5)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-teal-700 shadow-sm transition hover:bg-teal-50/50 active:scale-[0.99]"
            >
              Load Previous Dates
              <FaChevronDown />
            </button>
          )}
        </section>

        <section className="overflow-hidden rounded-[1.7rem] border border-teal-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-teal-50/30 via-white to-cyan-50/30 p-5">
            <SectionTitle
              icon={<FaGlobe />}
              title="About Sikkim Fatafat"
              subtitle="Live result information and historical records"
            />

            <div className="rounded-2xl border border-teal-100/70 bg-white p-4">
              <h3 className="text-sm font-black text-teal-950">
                Welcome to SikkimFatafat Result
              </h3>
              <p className="mt-2 text-[11px] font-medium leading-5 text-teal-800/80">
                Check today&apos;s Sikkim Fatafat results together with
                previous result charts in a simple mobile-friendly format.
              </p>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-teal-100/60 bg-teal-50/40 p-4">
                <FaTrophy className="text-amber-500" />
                <h3 className="mt-2 text-xs font-black uppercase tracking-wide text-teal-950">
                  Result Information
                </h3>
                <p className="mt-1.5 text-[10px] font-medium leading-5 text-teal-800/80">
                  This portal displays available result records and organizes
                  them by Bazi and date for easier reference.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <FaLightbulb className="text-amber-500" />
                <h3 className="mt-2 text-xs font-black uppercase tracking-wide text-amber-900">
                  Safety Notice
                </h3>
                <p className="mt-1.5 text-[10px] font-medium leading-5 text-amber-800/90">
                  No number prediction or guaranteed outcome is provided.
                  Avoid paying third parties for claims of guaranteed results.
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-100/60 bg-cyan-50/40 p-4">
                <FaSearch className="text-cyan-600" />
                <h3 className="mt-2 text-xs font-black uppercase tracking-wide text-teal-950">
                  How to Check
                </h3>
                <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-[10px] font-medium leading-4 text-teal-800/80">
                  <li>Open the live result board.</li>
                  <li>Find the required Bazi column.</li>
                  <li>Check the displayed result value.</li>
                </ol>
              </div>

              <div className="rounded-2xl border border-teal-100/60 bg-sky-50/40 p-4">
                <FaChartLine className="text-teal-600" />
                <h3 className="mt-2 text-xs font-black uppercase tracking-wide text-teal-950">
                  Previous Records
                </h3>
                <p className="mt-1.5 text-[10px] font-medium leading-5 text-teal-800/80">
                  Historical charts are grouped by date and limited to the
                  first 8 Bazi records for each day.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 border-t border-teal-100/60 bg-white px-5 py-4 text-[9px] font-medium leading-4 text-teal-700/60">
            <FaShieldAlt className="mt-0.5 shrink-0 text-teal-400" />
            <p>
              Information is provided for tracking and historical reference.
              Always play responsibly and follow applicable local regulations.
            </p>
          </div>
        </section>

        <footer className="pb-2 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-teal-600/40">
            Sikkim Fatafat • Live Result Board
          </p>
        </footer>
      </div>
    </main>
  );
}