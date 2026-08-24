"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaDownload,
  FaWhatsapp,
  FaTelegramPlane,
  FaSyncAlt,
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

const RESULT_NAME = "KOLKATA FATAFAT";

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
  createdAt: string | null | undefined,
): string {
  if (!createdAt) {
    return "";
  }

  const value = String(createdAt).trim();

  if (!value) {
    return "";
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  const ddmmyyyy = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/);

  if (ddmmyyyy) {
    return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  }

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

  if (parts.length !== 3) {
    return dateString;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getBaziId(item: ResultItem): number {
  const id = Number(item.bazi_id);

  return Number.isFinite(id) ? id : 999999;
}

function getValue(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }

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
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(2);

  /* =======================================================
     APP DATA
  ======================================================= */

  const { data: appData } = useGetAppDataQuery({});

  /* =======================================================
     RESULT API
  ======================================================= */

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
    refetch: () => void;
  };

  /* =======================================================
     DATE
  ======================================================= */

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();

      const formattedDate = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const dayName = now.toLocaleDateString("en-US", {
        weekday: "long",
      });

      setDate(
        `${dayName.toUpperCase()}, ${formattedDate.toUpperCase()}`,
      );

      setTodayDate(getLocalDateString());

      document.title = `${RESULT_NAME} Result Today ${formattedDate}`;
    };

    updateDate();

    const timer = window.setInterval(() => {
      updateDate();
    }, 60000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* =======================================================
     RAW RESULTS
  ======================================================= */

  const results: ResultItem[] = useMemo(() => {
    if (!rawResultData) {
      return [];
    }

    if (Array.isArray(rawResultData)) {
      return rawResultData;
    }

    if (Array.isArray(rawResultData.data)) {
      return rawResultData.data;
    }

    return [];
  }, [rawResultData]);

  /* =======================================================
     APP LINKS
  ======================================================= */

  const apkUrl = appData?.data?.apk_url || "#";

  const whatsappGroup =
    appData?.data?.whatsaap_group ||
    "https://chat.whatsapp.com";

  const telegramChannel =
    appData?.data?.telegram_channel ||
    "https://web.telegram.org/k/";

  /* =======================================================
     TODAY RESULTS
  ======================================================= */

  const todayResults = useMemo(() => {
    if (!todayDate) {
      return [];
    }

    return results
      .filter((item) => {
        return (
          normalizeResultDate(item.created_at) ===
          todayDate
        );
      })
      .sort((a, b) => getBaziId(a) - getBaziId(b));
  }, [results, todayDate]);

  /* =======================================================
     TODAY TABLE
  ======================================================= */

  const todayTableData: TodayTableItem[] = useMemo(() => {
    return todayResults.slice(0, 8).map((item, index) => ({
      no: index + 1,
      value: getValue(item.last_no),
      result: getValue(item.first_no),
    }));
  }, [todayResults]);

  /* =======================================================
     HISTORY DATA
  ======================================================= */

  const historyData: HistoryDataItem[] = useMemo(() => {
    const historyGrouped: Record<string, ResultItem[]> = {};

    results.forEach((item) => {
      const resultDate = normalizeResultDate(
        item.created_at,
      );

      if (!resultDate) {
        return;
      }

      if (resultDate === todayDate) {
        return;
      }

      if (!historyGrouped[resultDate]) {
        historyGrouped[resultDate] = [];
      }

      historyGrouped[resultDate].push(item);
    });

    return Object.keys(historyGrouped)
      .sort((a, b) => {
        return (
          new Date(`${b}T00:00:00`).getTime() -
          new Date(`${a}T00:00:00`).getTime()
        );
      })
      .map((dateStr) => {
        const dayData = historyGrouped[dateStr]
          .sort(
            (a, b) =>
              getBaziId(a) - getBaziId(b),
          )
          .slice(0, 8);

        return {
          date: formatHistoryDate(dateStr),
          values: dayData.map((item) =>
            getValue(item.last_no),
          ),
          results: dayData.map((item) =>
            getValue(item.first_no),
          ),
        };
      });
  }, [results, todayDate]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (resultLoading) {
    return (
      <div className="min-h-screen bg-[#eef0f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-yellow-500
              border-t-transparent
            "
          />

          <p className="font-bold text-gray-700">
            Loading Result...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (resultError) {
    return (
      <div className="min-h-screen bg-[#eef0f6] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-2xl font-black text-gray-800">
            Failed to Load Result
          </h2>

          <p className="text-gray-500 mt-2">
            Please try again.
          </p>

          <button
            onClick={() => refetch()}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-yellow-400
              px-7
              py-3
              font-black
              text-black
              shadow-lg
              transition
              hover:bg-yellow-500
              hover:scale-105
            "
          >
            <FaSyncAlt />
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RESULT TABLE
     
     IMPORTANT MOBILE FIX:
     
     1. Parent width = full.
     2. overflow-x-auto on wrapper.
     3. Table has fixed minimum width.
     4. Each column has fixed width.
     5. Mobile gets horizontal scrolling.
     6. Desktop remains full width.
  ======================================================= */

  const renderResultTable = (
    values: string[],
    resultsList: string[],
    showColumnNumbers = true,
  ) => {
    const columns = Array.from(
      { length: 8 },
      (_, index) => ({
        number: index + 1,
        value: values[index] || "-",
        result: resultsList[index] || "-",
      }),
    );

    return (
      <div className="w-full">
        {/* MOBILE SCROLL HINT */}
        <div
          className="
            flex
            items-center
            justify-between
            bg-gray-100
            px-3
            py-2
            text-xs
            font-bold
            text-gray-500
            sm:hidden
          "
        >
          <span>← Swipe table →</span>

          <span>
            8 Columns
          </span>
        </div>

        {/* SCROLL CONTAINER */}
        <div
          className="
            w-full
            overflow-x-auto
            overflow-y-hidden
            overscroll-x-contain
            touch-pan-x
            scrollbar-thin
            scrollbar-thumb-yellow-400
            scrollbar-track-gray-200
          "
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* 
            IMPORTANT:
            Do NOT use w-full here.

            The table must remain wide enough on mobile
            so the user can horizontally scroll through
            all 8 columns.
          */}
          <table
            className="
              w-full
              min-w-[720px]
              table-fixed
              border-collapse
            "
          >
            <colgroup>
              {columns.map((column) => (
                <col
                  key={column.number}
                  className="w-[90px] sm:w-auto"
                />
              ))}
            </colgroup>

            <thead>
              <tr className="bg-[#101827]">
                {columns.map((column) => (
                  <th
                    key={column.number}
                    className="
                      h-[58px]
                      min-w-[90px]
                      border-r
                      border-gray-600
                      px-2
                      text-center
                      text-lg
                      sm:text-xl
                      font-black
                      text-white
                      last:border-r-0
                    "
                  >
                    {showColumnNumbers
                      ? column.number
                      : ""}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* FIRST ROW */}
              <tr className="bg-white">
                {columns.map((column) => (
                  <td
                    key={`value-${column.number}`}
                    className="
                      h-[68px]
                      min-w-[90px]
                      border-r
                      border-b
                      border-gray-300
                      px-2
                      text-center
                      last:border-r-0
                    "
                  >
                    <span
                      className="
                        whitespace-nowrap
                        text-lg
                        sm:text-xl
                        font-black
                        text-gray-800
                      "
                    >
                      {column.value}
                    </span>
                  </td>
                ))}
              </tr>

              {/* SECOND ROW */}
              <tr className="bg-[#fff9e6]">
                {columns.map((column) => (
                  <td
                    key={`result-${column.number}`}
                    className="
                      h-[68px]
                      min-w-[90px]
                      border-r
                      border-gray-300
                      px-2
                      text-center
                      last:border-r-0
                    "
                  >
                    <span
                      className="
                        whitespace-nowrap
                        text-lg
                        sm:text-xl
                        font-black
                        text-red-600
                      "
                    >
                      {column.result}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef0f6] text-gray-900">
      <div
        className="
          mx-auto
          w-full
          max-w-[1350px]
          px-3
          sm:px-5
          lg:px-6
          pt-5
          pb-12
        "
      >
        {/* =================================================
            TODAY RESULT
        ================================================= */}

        <section
          className="
            w-full
            overflow-hidden
            rounded-[22px]
            border-[3px]
            border-yellow-400
            bg-white
            shadow-[0_15px_40px_rgba(0,0,0,0.18)]
          "
        >
          {/* TITLE */}

          <div
            className="
              bg-gradient-to-r
              from-[#ffc400]
              via-[#ffb300]
              to-[#ff8f00]
              px-4
              py-5
              text-center
              sm:py-6
            "
          >
            <h1
              className="
                text-2xl
                sm:text-3xl
                font-black
                uppercase
                tracking-tight
                text-black
              "
            >
              TODAY RESULT
            </h1>

            <p
              className="
                mt-1
                text-sm
                sm:text-lg
                font-bold
                text-black
              "
            >
              {date}
            </p>
          </div>

          {/* TODAY TABLE */}

          <div className="w-full p-0 sm:p-1">
            {todayTableData.length === 0 ? (
              <div className="bg-white px-4 py-12 text-center">
                <p className="text-lg font-bold text-gray-500">
                  No results available for today yet.
                </p>

                <button
                  onClick={() => refetch()}
                  disabled={resultFetching}
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-yellow-400
                    px-6
                    py-3
                    font-black
                    text-black
                    shadow-md
                    transition
                    hover:bg-yellow-500
                    disabled:opacity-60
                  "
                >
                  <FaSyncAlt
                    className={
                      resultFetching
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {resultFetching
                    ? "Checking..."
                    : "Check Again"}
                </button>

                {process.env.NODE_ENV ===
                  "development" && (
                  <p className="mt-3 text-xs text-gray-400">
                    Today: {todayDate}
                  </p>
                )}
              </div>
            ) : (
              renderResultTable(
                todayTableData.map(
                  (item) => item.value,
                ),
                todayTableData.map(
                  (item) => item.result,
                ),
              )
            )}
          </div>
        </section>

        {/* =================================================
            UPDATE BUTTONS
        ================================================= */}

        <section
          id="updates"
          className="
            mt-6
            flex
            flex-col
            items-center
            gap-3
          "
        >
          {/* DOWNLOAD */}

          <a
            href={apkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              w-full
              max-w-[520px]
              items-center
              justify-between
              rounded-2xl
              bg-gradient-to-r
              from-green-400
              to-green-600
              px-5
              py-3
              shadow-lg
              transition
              hover:scale-[1.02]
            "
          >
            <img
              src="/images/kolkataff.png"
              alt="Kolkata FF App"
              className="
                h-11
                w-11
                rounded-full
                object-cover
              "
            />

            <div className="flex-1 text-center text-black">
              <p className="text-base font-black">
                DOWNLOAD APP
              </p>

              <p className="text-xs font-bold">
                Fast Result
              </p>
            </div>

            <FaDownload className="text-xl text-black" />
          </a>

          {/* WHATSAPP */}

          <a
            href={whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              w-full
              max-w-[520px]
              items-center
              justify-between
              rounded-2xl
              bg-gradient-to-r
              from-green-500
              to-green-700
              px-5
              py-3
              shadow-lg
              transition
              hover:scale-[1.02]
            "
          >
            <FaWhatsapp className="text-3xl text-white" />

            <div className="flex-1 text-center text-white">
              <p className="text-base font-black">
                JOIN WHATSAPP GROUP
              </p>

              <p className="text-xs font-bold">
                Get Latest Updates
              </p>
            </div>

            <span className="text-2xl font-bold text-white">
              →
            </span>
          </a>

          {/* TELEGRAM */}

          <a
            href={telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              w-full
              max-w-[520px]
              items-center
              justify-between
              rounded-2xl
              bg-gradient-to-r
              from-sky-400
              to-blue-600
              px-5
              py-3
              shadow-lg
              transition
              hover:scale-[1.02]
            "
          >
            <FaTelegramPlane className="text-3xl text-white" />

            <div className="flex-1 text-center text-white">
              <p className="text-base font-black">
                JOIN TELEGRAM CHANNEL
              </p>

              <p className="text-xs font-bold">
                Latest Result Updates
              </p>
            </div>

            <span className="text-2xl font-bold text-white">
              →
            </span>
          </a>
        </section>

        {/* =================================================
            HISTORY
        ================================================= */}

        <section id="history" className="mt-7">
          {historyData
            .slice(0, visibleHistoryCount)
            .map((history) => (
              <div
                key={history.date}
                className="
                  mb-5
                  w-full
                  overflow-hidden
                  rounded-2xl
                  border-2
                  border-yellow-400
                  bg-white
                  shadow-lg
                "
              >
                {/* HEADER */}

                <div
                  className="
                    bg-gradient-to-r
                    from-yellow-400
                    to-orange-400
                    px-4
                    py-3
                    text-center
                    sm:text-left
                  "
                >
                  <p className="font-black text-black">
                    📅 {history.date}
                  </p>
                </div>

                {/* TABLE */}

                {renderResultTable(
                  history.values,
                  history.results,
                )}
              </div>
            ))}
        </section>

        {/* =================================================
            LOAD MORE
        ================================================= */}

        {visibleHistoryCount <
          historyData.length && (
          <div className="flex justify-center">
            <button
              onClick={() =>
                setVisibleHistoryCount(
                  (prev) => prev + 5,
                )
              }
              className="
                rounded-full
                bg-yellow-400
                px-7
                py-3
                font-black
                text-black
                shadow-lg
                transition
                hover:bg-yellow-500
                hover:scale-105
              "
            >
              ⬇️ Load More
            </button>
          </div>
        )}

        {/* =================================================
            SEO
        ================================================= */}

        <section
          className="
            mt-8
            rounded-2xl
            border
            border-yellow-400/30
            bg-white
            p-5
            shadow-lg
          "
        >
          <h2 className="text-xl font-black text-yellow-600">
            What is Kolkata FF?
          </h2>

          <p className="mt-2 leading-7 text-gray-600">
            Kolkata FF (Kolkata Fatafat) is a
            number-based guessing game played mainly
            in West Bengal. Users check results daily.
          </p>

          <h2 className="mt-5 text-xl font-black text-yellow-600">
            Kolkata FF Result Today
          </h2>

          <p className="mt-2 leading-7 text-gray-600">
            Results are updated multiple times daily.
            Users can check the latest available result
            after each round.
          </p>

          <h2 className="mt-5 text-xl font-black text-yellow-600">
            Important Notice
          </h2>

          <p className="mt-2 leading-7 text-gray-600">
            This page provides informational result
            data. Number-based games can involve
            financial risk. Please follow applicable
            local laws and play responsibly.
          </p>
        </section>
      </div>

      {/* =================================================
          BACK TO TOP
      ================================================= */}

      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        aria-label="Back to top"
        className="
          fixed
          bottom-5
          right-5
          z-50
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-yellow-400
          text-2xl
          font-black
          text-black
          shadow-xl
          transition
          hover:scale-110
        "
      >
        ↑
      </button>
    </main>
  );
}