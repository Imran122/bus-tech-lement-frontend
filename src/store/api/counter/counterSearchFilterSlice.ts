import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";

export interface ITickitBookingStateProps {
  calenderOpen: boolean;
  fromCounterId: number | null;
  destinationCounterId: number | null;
  coachType: string;
  date: string | null;
  returnDate: string | null;
  orderType: "One_Trip" | "Round_Trip";
  bookingCoachesList: any[];
  roundTripGobookingCoachesList: any[]; // Added for round trip go data
  roundTripReturnBookingCoachesList: any[]; // Added for round trip return data
  isLoadingBookingCoachesList: boolean;
  isLoadingRoundTripGoBookingCoachesList: boolean;
  isLoadingRoundTripReturnBookingCoachesList: boolean;
}

const initialState: ITickitBookingStateProps = {
  calenderOpen: false,
  fromCounterId: null,
  destinationCounterId: null,
  coachType: "AC",
  date: format(new Date(), "yyyy-MM-dd"),
  returnDate: null,
  orderType: "One_Trip",
  bookingCoachesList: [],
  roundTripGobookingCoachesList: [],
  roundTripReturnBookingCoachesList: [],
  isLoadingBookingCoachesList: false,
  isLoadingRoundTripGoBookingCoachesList: false,
  isLoadingRoundTripReturnBookingCoachesList: false,
};

const counterSearchFilterSlice = createSlice({
  name: "counterSearchFilter",
  initialState,
  reducers: {
    setFromCounterId(state, action: PayloadAction<number | null>) {
      state.fromCounterId = action.payload;
    },
    setDestinationCounterId(state, action: PayloadAction<number | null>) {
      state.destinationCounterId = action.payload;
    },
    setCoachType(state, action: PayloadAction<string>) {
      state.coachType = action.payload;
    },
    setDate(state, action: PayloadAction<string | null>) {
      state.date = action.payload;
    },
    setReturnDate(state, action: PayloadAction<string | null>) {
      state.returnDate = action.payload;
    },
    setOrderType(state, action: PayloadAction<"One_Trip" | "Round_Trip">) {
      state.orderType = action.payload;
    },
    setBookingCoachesList(state, action: PayloadAction<any[]>) {
      state.bookingCoachesList = action.payload;
    },
    setRoundTripGoBookingCoachesList(state, action: PayloadAction<any[]>) {
      state.roundTripGobookingCoachesList = action.payload;
    },
    setRoundTripReturnBookingCoachesList(state, action: PayloadAction<any[]>) {
      state.roundTripReturnBookingCoachesList = action.payload;
    },
    resetFilters(state) {
      Object.assign(state, initialState);
    },
    // Loading reducers
    setIsLoadingBookingCoachesList(state, action: PayloadAction<boolean>) {
      state.isLoadingBookingCoachesList = action.payload;
    },
    setIsLoadingRoundTripGoBookingCoachesList(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isLoadingRoundTripGoBookingCoachesList = action.payload;
    },
    setIsLoadingRoundTripReturnBookingCoachesList(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isLoadingRoundTripReturnBookingCoachesList = action.payload;
    },
  },
});

export const {
  setFromCounterId,
  setDestinationCounterId,
  setCoachType,
  setDate,
  setReturnDate,
  setOrderType,
  setBookingCoachesList,
  setRoundTripGoBookingCoachesList,
  setRoundTripReturnBookingCoachesList,
  resetFilters,
  setIsLoadingBookingCoachesList,
  setIsLoadingRoundTripGoBookingCoachesList,
  setIsLoadingRoundTripReturnBookingCoachesList,
} = counterSearchFilterSlice.actions;

export const selectCounterSearchFilter = (state: any) =>
  state.counterSearchFilter;

export default counterSearchFilterSlice.reducer;
