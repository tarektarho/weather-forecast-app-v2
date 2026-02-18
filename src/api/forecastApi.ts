import { baseApi } from "./baseApi"
import { forecastEndpoints } from "./endpoints"
import type { LatLonQueryArg, CityQueryArg } from "./types"
import type ForecastData from "../types/forecast"

export const forecastApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getForecastByLatLon: builder.query<ForecastData, LatLonQueryArg>({
      query: ({ lat, lon }) => forecastEndpoints.byLatLon(lat, lon),
      // Forecast data is less volatile — cache for 30 minutes
      keepUnusedDataFor: 1800,
      providesTags: (_result, _error, { lat, lon }) => [
        { type: "Forecast", id: `${lat},${lon}` },
      ],
    }),
    getForecastByCity: builder.query<ForecastData, CityQueryArg>({
      query: ({ city }) => forecastEndpoints.byCity(city),
      keepUnusedDataFor: 1800,
      providesTags: (_result, _error, { city }) => [
        { type: "Forecast", id: city.toLowerCase() },
      ],
    }),
  }),
})

export const { useGetForecastByLatLonQuery, useGetForecastByCityQuery } =
  forecastApi
