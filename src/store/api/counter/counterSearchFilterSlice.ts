import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ITickitBookingStateProps {
  calenderOpen: boolean;
  fromCounterId: number | null;
  destinationCounterId: number | null;
  schedule: string;
  coachType: string;
  date: string | null;
  bookingCoachesList: any[];
}
export interface ICounterSearchFilterState {
  calenderOpen: boolean;
  fromCounterId: number | null;
  destinationCounterId: number | null;
  schedule: string;
  coachType: string;
  date: string | null;
  bookingCoachesList: any[];
}
const initialState: ITickitBookingStateProps = {
  calenderOpen: false,
  fromCounterId: null,
  destinationCounterId: null,
  schedule: "",
  coachType: "",
  date: null,
  bookingCoachesList: [],
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
    setSchedule(state, action: PayloadAction<string>) {
      state.schedule = action.payload;
    },
    setCoachType(state, action: PayloadAction<string>) {
      state.coachType = action.payload;
    },
    setDate(state, action: PayloadAction<string | null>) {
      state.date = action.payload;
    },
    //
    setBookingCoachesList(state, action: PayloadAction<any[]>) {
      state.bookingCoachesList = action.payload;
    },
    resetFilters(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setFromCounterId,
  setDestinationCounterId,
  setSchedule,
  setCoachType,
  setDate,
  setBookingCoachesList,
  resetFilters,
} = counterSearchFilterSlice.actions;

export const selectCounterSearchFilter = (state: any) =>
  state.counterSearchFilter;

export default counterSearchFilterSlice.reducer;
