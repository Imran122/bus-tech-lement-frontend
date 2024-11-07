import { configureStore } from "@reduxjs/toolkit";
import counterSearchFilterReducer from "./api/counter/counterSearchFilterSlice";
import userReducer from "./api/user/userSlice";
import { apiSlice } from "./rootApi/apiSlice";
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
    counterSearchFilter: counterSearchFilterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
