import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "../api/baseApi"
import weatherUiReducer from "../features/weather/slice"

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    weatherUi: weatherUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

// Enable refetchOnFocus and refetchOnReconnect behaviours
setupListeners(store.dispatch)
