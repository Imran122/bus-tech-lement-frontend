import { apiSlice } from "../rootApi/apiSlice";

const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING BOOK SEAT
    addBookingSeat: builder.mutation({
      query: (data) => ({
        url: "/order/booking-seat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),
    //ADDING BOOK
    addBooking: builder.mutation({
      query: (data) => ({
        url: "/order/create-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),

    // ADDING BOOKING PAYMENT
    addBookingPayment: builder.mutation({
      query: (id) => ({
        url: `/payment/instance/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["booking"],
    }),
    //CHECKING SEAT FOR BOOKING
    checkingSeat: builder.mutation({
      query: (data) => ({
        url: "/order/check-seat-availability",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),

    //GETTING ALL COACH
    getBookingCoaches: builder.query({
      query: (data) => ({
        url: `/coach-config/get-coach-list?fromCounterId=${data?.fromCounterId}&destinationCounterId=${data?.destinationCounterId}&coachType=${data?.coachType}&date=${data?.date}&returnDate=${data.returnDate}&orderType=${data?.orderType}`,
        method: "GET",
      }),

      providesTags: ["booking"],
    }),
    getAllOrderList: builder.query({
      query: () => ({
        url: `/order/get-order-all`,
        method: "GET",
      }),

      providesTags: ["booking"],
    }),

    // // GETTING SINGLE COACH
    getPaymentDetailsWithHooks: builder.query({
      query: (id) => ({
        url: `/payment/webhook/${id}`,
      }),
    }),
    getTickitInfo: builder.query({
      query: (ticketNumber) => ({
        url: `/order/find-ticket/${ticketNumber}`,
      }),
    }),
    getTickitInfoByPhone: builder.query({
      query: (phoneNumber) => ({
        url: `/order/find-customer?phoneNumber=${phoneNumber}`,
      }),
    }),
    //due payemnt
    dueAmountPayment: builder.mutation({
      query: (id) => ({
        url: `/order/due-payment/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["booking"],
    }),
    // // UPDATING COACH
    // updateCoach: builder.mutation({
    //   query: ({ id, data }) => ({
    //     url: `/coach/update-coach/${id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: ["coach"],
    // }),

    // REMOVING BOOKING SEAT
    removeBookingSeat: builder.mutation({
      query: (data) => ({
        url: "/order/un-booking-seat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),
    unBookSeatFromCounterBooking: builder.mutation({
      query: (data) => ({
        url: "/order/cancel-booking",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["booking"],
    }),
  }),
});

export const {
  useGetBookingCoachesQuery,
  useAddBookingSeatMutation,
  useRemoveBookingSeatMutation,
  useAddBookingMutation,
  useCheckingSeatMutation,
  useAddBookingPaymentMutation,
  useGetAllOrderListQuery,
  useGetPaymentDetailsWithHooksQuery,
  useGetTickitInfoQuery,
  useDueAmountPaymentMutation,
  useUnBookSeatFromCounterBookingMutation,
  useGetTickitInfoByPhoneQuery,
} = bookingApi;
