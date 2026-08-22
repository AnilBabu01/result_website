import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://admin.kolkataff.tech/";

export const apiClient = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers) => {
      // Next.js localStorage access
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authtoken");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["getmarketlist", "allMatch", "result30days"],

  endpoints: (builder) => ({
    getResult30Days: builder.query({
      query: (name) => ({
        url: `https://admin.kolkataff.tech/api/get-result-30-days`,
        method: "GET",
      }),

      providesTags: ["result30days"],
    }),

    getAppData: builder.query({
      query: () => ({
        url: `https://admin.kolkataff.tech/api/getdata`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetResult30DaysQuery, useGetAppDataQuery } = apiClient;
