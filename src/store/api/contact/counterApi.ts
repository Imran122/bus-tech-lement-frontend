import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const counterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING COUNTER
    addCounter: builder.mutation({
      query: (data) => ({
        url: "/counter/create-counter",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["counter"],
    }),

    //GETTING ALL COUNTERS
    getCounters: builder.query({
      query: (data) => ({
        url: `/counter/get-counter-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["counter"],
    }),

    // GETTING SINGLE COUNTER
    getSingleCounter: builder.query({
      query: (id) => ({
        url: `/counter/get-counter-single/${id}`,
      }),
      providesTags: ["counter"],
    }),

    // UPDATING COUNTER
    updateCounter: builder.mutation({
      query: ({ id, data }) => ({
        url: `/counter/update-counter/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["counter"],
    }),

    // DELETING COUNTER
    deleteCounter: builder.mutation({
      query: (id) => ({
        url: `/counter/delete-counter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["counter"],
    }),
  }),
});

export const {
  useAddCounterMutation,
  useDeleteCounterMutation,
  useGetCountersQuery,
  useGetSingleCounterQuery,
  useUpdateCounterMutation,
} = counterApi;
