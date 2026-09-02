"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetResult30DaysQuery } from "../../redux/api/apiClient";

type ResultItem = {
  id?: number;
  game_id?: string;
  bazi_id: number;
  created_at: string;
  first_no: string;
  middle_no?: string;
  last_no?: string;
  isResult?: string;
  isResult2?: string;
  isResult3?: string;
};

type ApiResponse = {
  status?: boolean;
  data?: ResultItem[];
};

type BaziItem = {
  label: string;
  val: string;
  status?: boolean;
  result?: string;
};

type VoteItem = {
  num: number;
  votes: number;
  percent: number;
};

const RESULT_NAME = "KOLKATA FATAFAT";

const VOTE_STORAGE_KEY = "kolkata_ff_best_prediction_vote";

/* =========================================================
   DAILY BAZI GENERATOR
   ========================================================= */

function getDateSeed(date: Date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year * 10000 + month * 100 + day;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;

    let t = value;

    t = Math.imul(t ^ (t >>> 15), t | 1);

    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateBaziNumbers(
  dateSeed: number,
  baziId: number
): string[] {
  const digits = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];

  const random = seededRandom(
    dateSeed + baziId * 7919
  );

  // Fisher-Yates shuffle
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [digits[i], digits[j]] = [
      digits[j],
      digits[i],
    ];
  }

  return digits.slice(0, 5);
}

function generateDailyBaziConfig(
  date: Date = new Date()
): Record<number, string[]> {
  const dateSeed = getDateSeed(date);

  const config: Record<number, string[]> = {};

  for (let baziId = 1; baziId <= 8; baziId++) {
    config[baziId] = generateBaziNumbers(
      dateSeed,
      baziId
    );
  }

  return config;
}

/* =========================================================
   INITIAL VOTE DATA
   ========================================================= */

const INITIAL_VOTE_DATA: VoteItem[] = [
  { num: 0, votes: 44, percent: 15.7 },
  { num: 1, votes: 40, percent: 14.2 },
  { num: 7, votes: 36, percent: 12.8 },
  { num: 4, votes: 30, percent: 10.7 },
  { num: 8, votes: 28, percent: 10.0 },
  { num: 6, votes: 26, percent: 9.3 },
  { num: 9, votes: 24, percent: 8.5 },
  { num: 3, votes: 19, percent: 6.8 },
  { num: 2, votes: 18, percent: 6.4 },
  { num: 5, votes: 16, percent: 5.7 },
];

/* =========================================================
   COMPONENT
   ========================================================= */

export default function TipsPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const [hasVoted, setHasVoted] = useState(false);

  const [voteData, setVoteData] =
    useState<VoteItem[]>(INITIAL_VOTE_DATA);

  const numbers = Array.from(
    { length: 10 },
    (_, i) => i
  );

  /* =======================================================
     TODAY
     ======================================================= */

  const today = useMemo(() => {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  /* =======================================================
     CHECK PREVIOUS VOTE
     ======================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const savedVote =
        localStorage.getItem(
          VOTE_STORAGE_KEY
        );

      if (!savedVote) {
        return;
      }

      const parsedVote = JSON.parse(savedVote);

      /*
       * Reset voting on a new day.
       */
      if (parsedVote.date !== today) {
        localStorage.removeItem(
          VOTE_STORAGE_KEY
        );

        setHasVoted(false);
        setSelected(null);

        return;
      }

      if (
        typeof parsedVote.number ===
        "number"
      ) {
        setSelected(parsedVote.number);
        setHasVoted(true);
      }
    } catch (error) {
      console.error(
        "Failed to read saved vote:",
        error
      );
    }
  }, [today]);

  /* =======================================================
     DAILY BAZI CONFIG
     ======================================================= */

  const BAZI_CONFIG = useMemo(() => {
    return generateDailyBaziConfig(
      new Date()
    );
  }, [today]);

  /* =======================================================
     API
     ======================================================= */

  const {
    data: rawResultData,
    isLoading: resultLoading,
    isFetching: resultFetching,
    error: resultError,
    refetch,
  } = useGetResult30DaysQuery(
    RESULT_NAME,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000,
    }
  ) as {
    data?: ApiResponse | ResultItem[];
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
    refetch: () => void;
  };

  /* =======================================================
     NORMALIZE API RESPONSE
     ======================================================= */

  const resultData = useMemo<ResultItem[]>(
    () => {
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
    },
    [rawResultData]
  );

  /* =======================================================
     TODAY'S RESULTS
     ======================================================= */

  const todayResults = useMemo(() => {
    return resultData.filter((item) => {
      if (!item.created_at) {
        return false;
      }

      return item.created_at.startsWith(
        today
      );
    });
  }, [resultData, today]);

  /* =======================================================
     BAZI DATA
     ======================================================= */

  const baziData = useMemo<BaziItem[]>(
    () => {
      return Object.entries(
        BAZI_CONFIG
      ).map(
        ([baziIdString, values]) => {
          const baziId =
            Number(baziIdString);

          /*
           * Find today's result for this Bazi.
           * If multiple results exist,
           * use the latest one.
           */

          const matchingResults =
            todayResults
              .filter(
                (item) =>
                  Number(
                    item.bazi_id
                  ) === baziId
              )
              .sort((a, b) => {
                const dateA =
                  new Date(
                    a.created_at
                  ).getTime();

                const dateB =
                  new Date(
                    b.created_at
                  ).getTime();

                return dateB - dateA;
              });

          const result =
            matchingResults[0];

          const firstNo =
            result?.first_no
              ? String(
                  result.first_no
                ).trim()
              : "";

          /*
           * Check whether today's API result
           * exists inside dynamically generated
           * Bazi numbers.
           */

          const isMatched =
            firstNo !== "" &&
            values.includes(firstNo);

          return {
            label: `${baziId} Bazi`,
            val: values.join(","),
            status: result
              ? isMatched
              : undefined,
            result:
              firstNo || undefined,
          };
        }
      );
    },
    [
      todayResults,
      BAZI_CONFIG,
    ]
  );

  /* =======================================================
     VOTE
     ======================================================= */

  const handleVote = () => {
    if (selected === null) {
      alert(
        "Please select a number first."
      );

      return;
    }

    if (hasVoted) {
      return;
    }

    try {
      /*
       * Save today's vote.
       */

      localStorage.setItem(
        VOTE_STORAGE_KEY,
        JSON.stringify({
          date: today,
          number: selected,
        })
      );

      /*
       * Update local vote result.
       */

      setVoteData((previousData) => {
        const totalVotes =
          previousData.reduce(
            (sum, item) =>
              sum + item.votes,
            0
          ) + 1;

        return previousData.map(
          (item) => {
            if (
              item.num === selected
            ) {
              const newVotes =
                item.votes + 1;

              return {
                ...item,
                votes: newVotes,
                percent: Number(
                  (
                    (newVotes /
                      totalVotes) *
                    100
                  ).toFixed(1)
                ),
              };
            }

            return {
              ...item,
              percent: Number(
                (
                  (item.votes /
                    totalVotes) *
                  100
                ).toFixed(1)
              ),
            };
          }
        );
      });

      setHasVoted(true);
    } catch (error) {
      console.error(
        "Vote failed:",
        error
      );
    }
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (resultLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-yellow-400 font-bold text-lg">
          Loading tips...
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
     ======================================================= */

  if (resultError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 font-bold mb-4">
            Failed to load results.
          </p>

          <button
            onClick={() => refetch()}
            className="bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-3 pt-4 pb-10">

        {/* =================================================
            TIPS TABLE
        ================================================= */}

        <div className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-xl shadow-lg overflow-hidden">

          {/* HEADER */}

          <div className="grid grid-cols-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black p-3 font-bold text-center">
            <div>
              Tip of the Day
            </div>

            <div>
              {new Date().toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </div>
          </div>

          {/* BAZI DATA */}

          {baziData.map(
            (item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 border-t border-yellow-500/10 p-3 text-center"
              >
                {/* LABEL */}

                <div className="flex items-center justify-center gap-2">
                  <span>
                    {item.label}
                  </span>

                  {/* STATUS */}

                  {item.status !==
                    undefined && (
                    <span
                      className={
                        item.status
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {item.status
                        ? "✅"
                        : "❌"}
                    </span>
                  )}
                </div>

                {/* VALUES */}

                <div className="font-semibold text-yellow-400">
                  {item.val}
                </div>
              </div>
            )
          )}

          {/* NO DATA */}

          {todayResults.length ===
            0 && (
            <div className="p-4 text-center text-gray-400">
              No results available
              for today.
            </div>
          )}

          {/* FETCHING */}

          {resultFetching && (
            <div className="p-2 text-center text-xs text-yellow-400">
              Updating results...
            </div>
          )}
        </div>

        {/* =================================================
            TODAY API RESULTS
        ================================================= */}

        {todayResults.length >
          0 && (
          <div className="mt-4 bg-white/5 border border-yellow-500/10 rounded-xl p-4">

            <h3 className="text-yellow-400 font-bold mb-3 text-center">
              Today's Bazi Results
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

              {todayResults.map(
                (item, index) => (
                  <div
                    key={
                      item.id ??
                      `${item.bazi_id}-${index}`
                    }
                    className="bg-black/20 rounded-lg p-3 text-center"
                  >
                    <div className="text-gray-400 text-xs">
                      Bazi{" "}
                      {item.bazi_id}
                    </div>

                    <div className="text-yellow-400 font-bold text-lg">
                      {item.first_no}
                    </div>

                    {item.middle_no && (
                      <div className="text-gray-300 text-sm">
                        {
                          item.middle_no
                        }
                      </div>
                    )}

                    {item.last_no && (
                      <div className="text-gray-300 text-sm">
                        {
                          item.last_no
                        }
                      </div>
                    )}
                  </div>
                )
              )}

            </div>
          </div>
        )}

        {/* =================================================
            VOTING
        ================================================= */}

        <div className="mt-8 bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-xl p-5">

          {/* TITLE */}

          <h2 className="text-yellow-400 font-bold text-xl text-center">
            VOTE: BEST PREDICTION (0-9)
          </h2>

          {/* 0123456789 */}

          <div className="mt-4 text-center">
            <div className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-black/30 border border-yellow-500/20 rounded-full px-4 py-2">
              {numbers.map(
                (num) => (
                  <span
                    key={num}
                    className={`text-sm sm:text-base font-bold ${
                      selected === num
                        ? "text-yellow-400"
                        : "text-white"
                    }`}
                  >
                    {num}
                  </span>
                )
              )}
            </div>
          </div>

          {/* NUMBER BUTTONS */}

          <div className="flex flex-wrap justify-center gap-3 mt-5">

            {numbers.map(
              (num) => {
                const isSelected =
                  selected === num;

                return (
                  <button
                    key={num}
                    type="button"
                    disabled={hasVoted}
                    onClick={() =>
                      setSelected(num)
                    }
                    aria-label={`Vote for ${num}`}
                    className={`
                      w-11
                      h-11
                      sm:w-12
                      sm:h-12
                      rounded-full
                      font-bold
                      shadow-md
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black scale-110 ring-2 ring-yellow-300"
                          : "bg-white/10 text-white hover:bg-yellow-400/20 border border-yellow-500/20"
                      }
                      ${
                        hasVoted
                          ? "cursor-not-allowed opacity-80"
                          : "cursor-pointer hover:scale-105"
                      }
                    `}
                  >
                    {num}
                  </button>
                );
              }
            )}

          </div>

          {/* SELECTED NUMBER */}

          {!hasVoted &&
            selected !== null && (
              <p className="text-center text-gray-300 text-sm mt-4">
                Your prediction:{" "}
                <span className="text-yellow-400 font-bold text-lg">
                  {selected}
                </span>
              </p>
            )}

          {/* VOTE BUTTON */}

          {!hasVoted ? (
            <button
              type="button"
              onClick={handleVote}
              disabled={selected === null}
              className={`
                block
                mx-auto
                mt-5
                px-10
                py-2.5
                rounded-full
                font-bold
                shadow-lg
                transition-all
                ${
                  selected === null
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-500 to-yellow-300 text-black hover:scale-105 hover:shadow-yellow-500/30"
                }
              `}
            >
              VOTE
            </button>
          ) : (
            <div className="text-center mt-5">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-2.5 rounded-full font-bold">
                <span>✓</span>
                <span>
                  VOTE CASTED
                </span>
              </div>

              <p className="text-green-400 mt-3 text-sm">
                ✅ You have already
                voted.
              </p>

              {selected !== null && (
                <p className="text-gray-400 text-xs mt-1">
                  Your prediction:{" "}
                  <span className="text-yellow-400 font-bold">
                    {selected}
                  </span>
                </p>
              )}
            </div>
          )}

        </div>

        {/* =================================================
            LIVE RESULTS
        ================================================= */}

        <div className="mt-6 bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-4 rounded-xl shadow-lg">

          <h2 className="text-yellow-400 font-bold text-center mb-4">
            LIVE VOTE RESULTS
          </h2>

          {voteData
            .slice()
            .sort(
              (a, b) =>
                b.votes - a.votes
            )
            .map((item) => (
              <div
                key={item.num}
                className="mb-3"
              >

                {/* INFO */}

                <div className="flex justify-between items-center text-sm mb-1">

                  <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold">
                    {item.num}
                  </span>

                  <span className="text-gray-300">
                    {item.votes} Votes
                  </span>

                  <span className="text-yellow-400 font-bold">
                    {item.percent}%
                  </span>

                </div>

                {/* PROGRESS BAR */}

                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">

                  <div
                    className="
                      bg-gradient-to-r
                      from-yellow-400
                      to-yellow-600
                      h-2.5
                      rounded-full
                      transition-all
                      duration-500
                    "
                    style={{
                      width: `${Math.min(
                        item.percent,
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>
            ))}

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-6 bg-white/5 backdrop-blur-lg border border-yellow-500/20 p-5 rounded-xl leading-7 text-gray-300">

          <h2 className="text-yellow-400 font-bold text-lg mb-2">
            Kolkata FF Tips & Guide
          </h2>

          <p>
            Kolkata FF is a
            number-based guessing
            game. We provide daily
            tips based on analysis
            and trends. These tips
            are not guaranteed
            results.
          </p>

          <h3 className="text-yellow-400 font-bold mt-4">
            Play Responsibly
          </h3>

          <p>
            This is a luck-based
            game. Always play within
            limits and never depend
            on it as income.
          </p>

        </div>

      </div>
    </div>
  );
}