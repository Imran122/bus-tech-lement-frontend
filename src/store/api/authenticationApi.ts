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
    forgetPasswordMail: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password-request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    otpVerify: builder.mutation({
      query: (data) => ({
        url: "/auth/otp-verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    newPaaswordChange: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-changePassword",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useLoginMutation,
  useResetPasswordMutation,
  useForgetPasswordMailMutation,
  useOtpVerifyMutation,
  useNewPaaswordChangeMutation,
} = authenticationApi;
