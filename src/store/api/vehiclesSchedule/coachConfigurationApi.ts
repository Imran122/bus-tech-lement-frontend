import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const coachApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING COACH CONFIGURATION
    addCoachConfiguration: builder.mutation({
      query: (data) => ({
        url: "/coach-config/create-coach-config",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coach_configuration"],
    }),

    //GETTING ALL COACH CONFIGURATIONS
    getCoachConfigurations: builder.query({
      query: (data) => ({
        url: `/coach-config/get-coach-config-all?search=${
          data?.search || ""
        }&size=${data?.size || fallback.querySize}&page=${
          data?.page || 1
        }&sortOrder=${data?.sort || fallback.sortOrder}`,
      }),
      providesTags: ["coach_configuration"],
    }),
    //GETTING ALL UPDATE COACH CONFIGURATIONS
    getUpdateCoachConfigurations: builder.query({
      query: (data) => ({
        url: `/coach-config/get-coach-config-update?search=${
          data?.search || ""
        }&size=${data?.size || fallback.querySize}&page=${
          data?.page || 1
        }&sortOrder=${data?.sort || fallback.sortOrder}`,
      }),
      providesTags: ["coach_configuration","update_coach_configuration"],
    }),

    // GETTING SINGLE COACH CONFIGURATION
    getSingleCoachConfiguration: builder.query({
      query: (id) => ({
        url: `/coach-config/get-coach-config-single/${id}`,
      }),
      providesTags: ["coach_configuration"],
    }),

    // UPDATING COACH CONFIGURATION
    updateCoachConfiguration: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coach-config/update-coach-config/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["coach_configuration"],
    }),

    // DELETING COACH CONFIGURATION
    deleteCoachConfiguration: builder.mutation({
      query: (id) => ({
        url: `/coach-config/delete-coach-config/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coach_configuration"],
    }),
    getModalCoachInfoByDate: builder.query({
      query: (date) => `/coach-config/get-coach-list-today?date=${date}`,
    }),
  }),
});

export const {
  useAddCoachConfigurationMutation,
  useGetUpdateCoachConfigurationsQuery,
  useDeleteCoachConfigurationMutation,
  useGetCoachConfigurationsQuery,
  useGetSingleCoachConfigurationQuery,
  useUpdateCoachConfigurationMutation,
  useGetModalCoachInfoByDateQuery,
} = coachApi;
