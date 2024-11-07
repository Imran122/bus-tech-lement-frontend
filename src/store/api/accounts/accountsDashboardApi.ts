// api/accountsDashboardApi.js

import { apiSlice } from "../../rootApi/apiSlice";

const accountsDashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Expense Account Dashboard
    getExpenseAccountDashboard: builder.query({
      query: () => ({
        url: "/expense/get-expense-account-dashboard",
        method: "GET",
      }),
      providesTags: ["accounts-dashboard"],
    }),

    // PUT: Authorize Expense
    authorizeExpense: builder.mutation({
      query: ({ expenseId, body }) => ({
        url: `/expense/authorize-expense/${expenseId}`,
        method: "PUT",
        body, // This should include only the body content you want to send
      }),
      invalidatesTags: ["accounts-dashboard"], // Adjust tags if needed
    }),

    // GET: details expense
    getSingleExpenseDetails: builder.query({
      query: (id) => ({
        url: `/expense/get-expense-account-dashboard?id=${id}`,
        method: "GET",
      }),
      providesTags: ["accounts-dashboard"],
    }),
    // GET: Collection Account Dashboard
    getCollectionAccountDashboard: builder.query({
      query: () => ({
        url: "/collection/get-collection-account-dashboard",
        method: "GET",
      }),
      providesTags: ["accounts-dashboard"],
    }),

    // PUT: Authorize Collection
    authorizeCollection: builder.mutation({
      query: ({ collectionId, body }) => ({
        url: `/collection/authorize-collection/${collectionId}`, // URL using collectionId
        method: "PUT",
        body, // This should contain the body as per your Joi validation
      }),
      invalidatesTags: ["accounts-dashboard"], // Adjust tags as needed
    }),
  }),
});

export const {
  useGetSingleExpenseDetailsQuery,
  useGetExpenseAccountDashboardQuery,
  useAuthorizeExpenseMutation,
  useGetCollectionAccountDashboardQuery,
  useAuthorizeCollectionMutation,
} = accountsDashboardApi;
