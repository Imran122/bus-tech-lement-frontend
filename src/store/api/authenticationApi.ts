import { apiSlice } from "../rootApi/apiSlice";

const authenticationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // LOGIN USER
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useLoginMutation, useResetPasswordMutation } = authenticationApi;
