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
    getTripReport: builder.query({
      query: ({ registrationNo, fromDate, toDate }) => ({
        url: `/admin/trip-report?registrationNo=${registrationNo}&fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
      providesTags: ["tripReport"],
    }),
    getExpenseSubCategoryReport: builder.query({
      query: ({ registrationNo, fromDate, toDate }) => ({
        url: `/admin/expense-accounts/get-expense-report?registrationNo=${registrationNo}&fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
      providesTags: ["tripReport"],
    }),
    getUserList: builder.query({
      query: ({ size, page }) => ({
        url: `/user/get-user-all?size=${size}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    getTripDataByDate: builder.query({
      query: ({ fromDate, toDate }) => ({
        url: `/admin/get-trip-number?fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
      providesTags: ["admin_report"],
    }),
    fetchTripWiseReport: builder.query({
      query: ({ tripNumber }) => ({
        url: `/admin/trip-wise-report?tripNumber=${tripNumber}`,
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
  useGetTripReportQuery,
  useGetTripDataByDateQuery,
  useFetchTripWiseReportQuery,
} = adminReportApi;
