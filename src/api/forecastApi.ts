import { baseApi } from "./baseApi"
import { forecastEndpoints } from "./endpoints"
import type ForecastData from "../types/forecast"

export const forecastApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getForecastByLatLon: builder.query<
      ForecastData,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) => forecastEndpoints.byLatLon(lat, lon),
      providesTags: (_result, _error, { lat, lon }) => [
        { type: "Forecast", id: `${lat},${lon}` },
      ],
    }),
    getForecastByCity: builder.query<ForecastData, { city: string }>({
      query: ({ city }) => forecastEndpoints.byCity(city),
      providesTags: (_result, _error, { city }) => [
        { type: "Forecast", id: city.toLowerCase() },
      ],
    }),
  }),
})

export const { useGetForecastByLatLonQuery, useGetForecastByCityQuery } =
  forecastApi
