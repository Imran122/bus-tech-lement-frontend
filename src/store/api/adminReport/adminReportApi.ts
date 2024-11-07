import { apiSlice } from "@/store/rootApi/apiSlice";

const adminReportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodaysSaleAdminReport: builder.query({
      query: () => ({
        url: `/admin/get-today-sales`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getUserWiseSaleAdminReport: builder.query({
      query: ({ userId, fromDate, toDate }) => ({
        url: `/admin/user-wise-sales?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getUserList: builder.query({
      query: ({ size, page }) => ({
        url: `/user/get-user-all?size=${size}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
  }),
});

export const {
  useGetTodaysSaleAdminReportQuery,
  useGetUserWiseSaleAdminReportQuery,
  useGetUserListQuery,
} = adminReportApi;
