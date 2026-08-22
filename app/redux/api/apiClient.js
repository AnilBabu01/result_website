import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://admin.kolkataff.tech/";

export const apiClient = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authtoken");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: [
    "getmarketlist",
    "allMatch",
    "result30days",
    "monthlyResult",
  ],

  endpoints: (builder) => ({
    // -----------------------------
    // 30 DAYS RESULT
    // -----------------------------
    getResult30Days: builder.query({
      query: () => ({
        url: "api/get-result-30-days",
        method: "GET",
      }),

      providesTags: ["result30days"],
    }),

    // -----------------------------
    // APP DATA
    // -----------------------------
    getAppData: builder.query({
      query: () => ({
        url: "api/getdata",
        method: "GET",
      }),
    }),

    // -----------------------------
    // MONTHLY RESULT
    // Example:
    // getMonthlyResult({ year: 2026, month: 8 })
    //
    // API:
    // /api/get-result-monthly/2026/8
    // -----------------------------
    getMonthlyResult: builder.query({
      query: ({ year, month }) => ({
        url: `api/get-result-monthly/${year}/${month}`,
        method: "GET",
      }),

      providesTags: ["monthlyResult"],
    }),
  }),
});

export const {
  useGetResult30DaysQuery,
  useGetAppDataQuery,
  useGetMonthlyResultQuery,
} = apiClient;