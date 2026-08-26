"use client";

import { useEffect, useMemo, useState } from "react";
import { FaSyncAlt, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

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

function normalizeResultDate(createdAt: string | null | undefined): string {
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

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  return `${day}/${month}/${year}`;
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
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(5);

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
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const dayName = now.toLocaleDateString("en-US", {
        weekday: "long",
      });

      setDate(`(${dayName.toUpperCase()}, ${formattedDate.toUpperCase()})`);

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

  const whatsappGroup = appData?.data?.whatsaap_group || "#";

  const telegramChannel = appData?.data?.telegram_channel || "#";

  /* =======================================================
     TODAY RESULTS
  ======================================================= */

  const todayResults = useMemo(() => {
    if (!todayDate) {
      return [];
    }

    return results
      .filter((item) => {
        return normalizeResultDate(item.created_at) === todayDate;
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
      const resultDate = normalizeResultDate(item.created_at);

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
          .sort((a, b) => getBaziId(a) - getBaziId(b))
          .slice(0, 8);

        return {
          date: formatHistoryDate(dateStr),
          values: dayData.map((item) => getValue(item.last_no)),
          results: dayData.map((item) => getValue(item.first_no)),
        };
      });
  }, [results, todayDate]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (resultLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />

          <p className="font-bold text-gray-700">Loading Result...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (resultError) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full border border-gray-200">
          <div className="text-4xl mb-3">⚠️</div>

          <h2 className="text-xl font-bold text-gray-800">
            Failed to Load Result
          </h2>

          <p className="text-gray-500 text-sm mt-1">Please try again.</p>

          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded bg-amber-400 px-6 py-2 font-bold text-black shadow transition hover:bg-amber-500"
          >
            <FaSyncAlt />
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RESULT TABLE RENDERER
  ======================================================= */

  const renderResultTable = (values: string[], resultsList: string[]) => {
    const columns = Array.from({ length: 8 }, (_, index) => ({
      number: index + 1,
      value: values[index] || "-",
      result: resultsList[index] || "-",
    }));

    return (
      <div className="w-full bg-white">
        {/* TOP ROW */}
        <div className="grid grid-cols-8 border-b border-gray-300">
          {columns.map((column, index) => (
            <div
              key={`val-${column.number}`}
              className={`py-2 px-0.5 text-center text-xs sm:text-base font-bold text-gray-900 ${
                index !== 7 ? "border-r border-gray-300" : ""
              }`}
            >
              {column.value}
            </div>
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-8">
          {columns.map((column, index) => (
            <div
              key={`res-${column.number}`}
              className={`py-2 px-0.5 text-center text-xs sm:text-base font-bold text-gray-900 ${
                index !== 7 ? "border-r border-gray-300" : ""
              }`}
            >
              {column.result}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-gray-900 font-sans pb-12">
      {/* MAIN CONTAINER */}

      <div className="mx-auto max-w-4xl px-2 sm:px-4 pt-4 flex flex-col items-center">
        {/* =================================================
            TODAY RESULT CARD
        ================================================= */}

        <section className="w-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden mb-3">
          {/* DATE HEADER */}

          <div className="bg-[#fdd835] py-2 text-center border-b border-yellow-400">
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-black">
              <span className="text-red-600 text-xs">🔴</span>

              <span>{date || "(WEDNESDAY, 26 AUGUST 2026)"}</span>
            </div>
          </div>

          {/* TODAY TABLE */}

          <div className="relative">
            {todayTableData.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-bold">
                No results available for today yet.
              </div>
            ) : (
              renderResultTable(
                todayTableData.map((item) => item.value),
                todayTableData.map((item) => item.result),
              )
            )}
          </div>
        </section>

        {/* =================================================
            REFRESH BUTTON
        ================================================= */}

        <button
          onClick={() => refetch()}
          disabled={resultFetching}
          className="w-full max-w-xs bg-[#fdd835] hover:bg-yellow-400 text-black font-bold text-xs sm:text-sm py-2 px-4 rounded shadow-sm border border-yellow-500 flex items-center justify-center gap-2 mb-3 disabled:opacity-60"
        >
          <span className="text-blue-600 font-bold">🖼️</span>

          {resultFetching ? "Refreshing..." : "Refresh Karo"}
        </button>

        {/* =================================================
            DOWNLOAD APP
        ================================================= */}

        {apkUrl !== "#" && (
          <a
            href={apkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs bg-[#d32f2f] hover:bg-red-700 text-white rounded-lg p-2 flex items-center justify-between shadow-md transition mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl bg-yellow-400 rounded p-1">👑</div>

              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider leading-none">
                  DOWNLOAD APP
                </div>

                <div className="text-xs font-black leading-tight">
                  Get Results Faster
                </div>
              </div>
            </div>

            <div className="border border-white/40 rounded p-1 text-xs">📥</div>
          </a>
        )}

        {/* =================================================
            WHATSAPP GROUP
        ================================================= */}

        {whatsappGroup !== "#" && (
          <a
            href={whatsappGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-lg p-2 flex items-center justify-between shadow-md transition mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl bg-white text-[#25D366] rounded-full p-1">
                <FaWhatsapp />
              </div>

              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider leading-none">
                  JOIN WHATSAPP
                </div>

                <div className="text-xs font-black leading-tight">
                  Join Our WhatsApp Group
                </div>
              </div>
            </div>

            <div className="border border-white/40 rounded p-1 text-xs">→</div>
          </a>
        )}

        {/* =================================================
            TELEGRAM CHANNEL
        ================================================= */}

        {telegramChannel !== "#" && (
          <a
            href={telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs bg-[#229ED9] hover:bg-[#168ac1] text-white rounded-lg p-2 flex items-center justify-between shadow-md transition mb-6"
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl bg-white text-[#229ED9] rounded-full p-1">
                <FaTelegramPlane />
              </div>

              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider leading-none">
                  JOIN TELEGRAM
                </div>

                <div className="text-xs font-black leading-tight">
                  Join Our Telegram Channel
                </div>
              </div>
            </div>

            <div className="border border-white/40 rounded p-1 text-xs">→</div>
          </a>
        )}

        {/* =================================================
            OLD RESULTS HEADER
        ================================================= */}

        <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-wide uppercase mb-3 text-center">
          OLD RESULTS
        </h2>

        {/* =================================================
            HISTORY LIST
        ================================================= */}

        <div className="w-full flex flex-col gap-3">
          {historyData.slice(0, visibleHistoryCount).map((history) => (
            <div
              key={history.date}
              className="w-full bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-[#fdd835] py-1.5 px-4 text-center border-b border-yellow-400">
                <span className="text-xs sm:text-sm font-bold text-black">
                  {history.date}
                </span>
              </div>

              {renderResultTable(history.values, history.results)}
            </div>
          ))}
        </div>

        {/* =================================================
            LOAD MORE
        ================================================= */}

        {visibleHistoryCount < historyData.length && (
          <button
            onClick={() => setVisibleHistoryCount((prev) => prev + 5)}
            className="mt-5 bg-[#fdd835] hover:bg-yellow-400 text-black font-bold text-xs sm:text-sm px-6 py-2 rounded shadow border border-yellow-500 transition"
          >
            Load More Results
          </button>
        )}
      </div>

      {/* ===================================================
          SEO / CONTENT
      =================================================== */}

      <div className="p-4">
        <p className="text-black font-bold text-3xl">what is kolkata ff ?</p>

        <p>
          kolkata ff sabse pahle This is the kolkata photo fort official ⭐⭐⭐
          No# 1✅✅✅ website🌏 for all Kolkata people who want to get fast
          kolkata ff fatafat result. Here you can see all today and previous all
          old and new results online free. This is the main page where you can
          get today result and past 10-day result kolkata photo fort. car
          accident lawyers dollars billion or trillion $. Insurance CAR you can
          win easily by this website. Insurance policy is very simple. Health
          insurance companies.
        </p>

        <p className="text-black font-bold text-[20px]">
          Welcome to Kolkata Fatafat Result
        </p>

        <p>
          Kolkata Fatafat Today Result ❤️ Kolkata FF Result Sabse Pahle Yahi Par
          Aata Hai ❤️ কলকাতা ফতাফত ❤️ कोलकाता Fatafat Chart Dekho ❤️ Patti Aur
          Single Ke Sath Chart 2020-21 ❤️ কলকাতা ff Welcome to Kolkata Fatafat
          Result
        </p>

        <p>
          kolkata fatafat result kolkata ff result Satta game is the greatest
          and most playing game everywhere on the country. Not just single
          persons of West Bengal play the game yet additionally other state’s
          kin play it well indeed. This game is unlawful. However, a great many
          individuals play the game and procure a prespecified reward.
        </p>

        <p>
          This game is likewise similar to Satta game. Assuming you become
          successful to figure the right number, it implies you have won a major
          measure of cash. On the off chance that not, you have lost all the
          cash. We just give Kolkata FF Fatafat Result on this entryway.
        </p>

        <p>
          Something more this game played 8 times each day and furthermore
          refreshes multiple times result. In the wake of playing the game each
          and every individual who has put away their cash will get inquisitive
          about their outcome. So they look for their outcome. What’s more, this
          entryway is the best one for your Kolkata FF Fun Result 2020.
        </p>

        <p className="text-black font-bold text-[20px]">
          Kolkata FF Tips for free
        </p>

        <p>
          There are a great number of people on YouTube who will make a promise
          to provide the exact number. But there is no one who can tell the
          exact number. So never believe in such channels who will make fake
          promises and left you in a great loss and never give them money. This
          game is completely based on luck and your own intellect. With the help
          of Kolkata FF Old Results, you can make some estimates about the
          upcoming number. And then left it on your luck. in order to gain the
          trust of the audience who will follow you and to be able to actually
          earn money from the blog, you must talk about a specific field, a
          specific performance and not spend your days switching between
          different topics. It is important that you choose a field in which you
          have a wide amount of knowledge and experience, as this is a key
          factor that makes you present topics and articles that are really
          useful to the audienc. kolkata ff provide you the best free tips.
        </p>

        <p className="text-black font-bold text-[20px]">
          How to find Kolkata FF Today Result
        </p>

        <p>
          Here are a very few steps which will help you to find out your game
          result. Let us have a look at these steps one by one. At first, you
          have to open this portal. Now on the home page of this portal find out
          your today game bazi. Then verify the number below that. If it matches
          your number then you have won the game
        </p>

        <p className="text-black font-bold text-[20px]">
          Kolkata FF Old Result
        </p>

        <p>
          On the home page of this satta portal, you will find a large previous
          record table of the results. In this table, you will become able to
          find out KolkataFF Old Results of previous days. If you want to check
          any specific month or day result then simply scroll the page down and
          in the table find out that day. Now you can see all the results of
          that day on the table. doing some research on the web, through
          whatsapp groups, by reading what people are commenting on for example
          about the field you are going to write about, you can elicit some
          specific and specific game numbers that help you draw personal
          characteristics from characters that are well suited to your field,
        </p>

        <p className="text-black font-bold text-[20px]">
          Kolkata FF Online Result
        </p>

        <p>
          As we all are aware that this game is playing in west Bengal. Yet
          millions of people play this game. In the past, this game is played in
          offline mode. But today with the great progress of the internet this
          game is also played in online mode. Now you can play it through the
          downloaded application and also check your কলকাতা fatafat Online
          sitting at your home.
        </p>

        <p className="text-black font-bold text-[20px]">
          Why People Play kolkata fotafot
        </p>

        <p>
          As we have earlier discuss about the people of West Bengal. In West
          Bengal, there are many poor people who barely earn their daily
          livings. During the occasion of Durga Pooja and other religious
          festivals, poor people of the state are not in such a position they
          can celebrate them.
        </p>

        <p className="text-black font-bold text-[20px]">
          kolkata ff fatafat result Today Live Khel Result
        </p>

        <p>
          As we have earlier discussed that this game is based on guessing
          numbers. There is no trick that can tell you about the upcoming
          result. Not available on any online site or any youtube channel. All
          those who claim to give you guessing numbers are fake. Here on this
          page, we will guarantee you one thing that you will find all the
          information about this game and the result of the game first of all.
        </p>
      </div>
    </main>
  );
}
