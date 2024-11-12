import { configureStore } from "@reduxjs/toolkit";
import counterSearchFilterReducer from "./api/counter/counterSearchFilterSlice";
import coachConfigModalReducer from "./api/user/coachConfigModalSlice";
import userReducer from "./api/user/userSlice";
import { apiSlice } from "./rootApi/apiSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
    counterSearchFilter: counterSearchFilterReducer,
    coachConfigModal: coachConfigModalReducer, // Add the reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
