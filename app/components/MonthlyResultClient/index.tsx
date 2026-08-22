"use client";

import Navbar from "@/app/components/Navbar";
import LiveBar from "@/app/components/LiveBar";
import Link from "next/link";
import { useGetMonthlyResultQuery } from "@/app/redux/api/apiClient";

type ResultItem = {
  id: number;
  first_no: number;
  last_no: number;
  result: string | number;
  created_at: string;
};

type DayData = {
  date: string;
  values: [string, string][];
};

type Props = {
  year: string;
  month: string;
};

export default function MonthlyResultClient({
  year,
  month,
}: Props) {
  const selectedYear = Number(year);
  const selectedMonth = Number(month);

  const {
    data: apiData,
    isLoading,
    isError,
  } = useGetMonthlyResultQuery({
    year: selectedYear,
    month: selectedMonth,
  });

  const groupedData: DayData[] = [];

  const results: ResultItem[] = apiData?.data ?? [];

  results.forEach((item) => {
    const dateObject = new Date(item.created_at);

    const date = dateObject.toLocaleDateString("en-GB");

    let existingDay = groupedData.find(
      (day) => day.date === date
    );

    if (!existingDay) {
      existingDay = {
        date,
        values: [],
      };

      groupedData.push(existingDay);
    }

    existingDay.values.push([
      String(item.last_no ?? "-"),
      String(item.first_no ?? "-"),
    ]);
  });

  const monthName = new Date(
    selectedYear,
    selectedMonth - 1,
    1
  ).toLocaleString("default", {
    month: "long",
  });

  return (
    <>
      <Navbar />
      <LiveBar />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 pt-28 px-4 md:px-10">

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-wide">
            {monthName.toUpperCase()} {year}
          </h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Monthly Result Chart
          </p>

          <div className="mt-5">
            <Link
              href="/old-kolkata-ff-fatafat-result"
              className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              ← Back
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent mx-auto" />

              <p className="mt-4 text-gray-600 font-medium">
                Loading {monthName} {year} results...
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div className="max-w-xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-semibold">
              Failed to load monthly results.
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Please try again later.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          groupedData.length === 0 && (
            <div className="max-w-xl mx-auto bg-white/70 border border-yellow-200 shadow-lg rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">
                📂
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                No Results Found
              </h2>

              <p className="text-gray-500 mt-2">
                No results are available for {monthName} {year}.
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          groupedData.length > 0 && (
            <div className="space-y-6">
              {groupedData.map((item, index) => (
                <div
                  key={`${item.date}-${index}`}
                  className="backdrop-blur-md bg-white/70 border border-white/40 shadow-xl rounded-2xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-center py-3 text-lg font-semibold text-black">
                    {item.date}
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 p-3 md:p-4">
                    {item.values.map((val, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center justify-center border"
                      >
                        <span className="text-xl md:text-2xl font-bold text-gray-800">
                          {val[0]}
                        </span>

                        <span className="text-sm text-yellow-600 font-semibold mt-1">
                          {val[1]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        <div className="h-10" />
      </div>
    </>
  );
}