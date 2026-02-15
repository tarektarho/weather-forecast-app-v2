import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

/**
 * UI-only slice for weather feature.
 * Manages client-side state that is not related to API data caching.
 */
interface WeatherUiState {
  error: boolean
}

const initialState: WeatherUiState = {
  error: false,
}

export const weatherUiSlice = createSlice({
  name: "weatherUi",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload
    },
  },
})

export const { setError } = weatherUiSlice.actions
export default weatherUiSlice.reducer
