import type { Dispatch } from "react"
import type React from "react"
import { createContext, useContext } from "react"
import type WeatherData from "../types/weather"
import type ForecastData from "../types/forecast"
import type AirPollutionData from "../types/airPollution"

/** Shared shape exposed via context – only the fields widgets actually consume. */
export interface QueryResult<T> {
  data?: T
  error?: unknown
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  isError: boolean
  isUninitialized: boolean
}

/**
 * Interface defining the shape of the context value used in the WeatherProvider.
 */
export interface WeatherContextValue {
  city: string
  setCity: React.Dispatch<React.SetStateAction<string>>
  searchByCity: (city?: string) => void
  weatherData: QueryResult<WeatherData>
  forecastData: QueryResult<ForecastData>
  airPollutionData: QueryResult<AirPollutionData>
  copyShareUrl: () => void
  modal: boolean
  hideModal: () => void
  error: string | undefined
  hideError: () => void
  info: string | undefined
  setInfo: Dispatch<React.SetStateAction<string | undefined>>
  setError: Dispatch<React.SetStateAction<string | undefined>>
}

/**
 * Create a context for providing Weather-related data and actions to components.
 */
export const WeatherContext = createContext<WeatherContextValue | undefined>(
  undefined,
)
export const ERROR_CONTEXT_OUTSIDE =
  "Weather context cannot be outside of WeatherProvider"

// Custom hook to consume the Weather context in components
export const useWeather = (): WeatherContextValue => {
  const contextValue = useContext(WeatherContext)

  // Throw an error if the hook is used outside the WeatherProvider
  if (contextValue === undefined) {
    throw new Error(ERROR_CONTEXT_OUTSIDE)
  }

  return contextValue
}
