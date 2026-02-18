import { baseApi } from "./baseApi"
import { weatherEndpoints } from "./endpoints"
import type { LatLonQueryArg, CityQueryArg } from "./types"
import type WeatherData from "../types/weather"

export const weatherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeatherByLatLon: builder.query<WeatherData, LatLonQueryArg>({
      query: ({ lat, lon }) => weatherEndpoints.byLatLon(lat, lon),
      // Current weather changes frequently — cache for 10 minutes
      keepUnusedDataFor: 600,
      providesTags: (_result, _error, { lat, lon }) => [
        { type: "Weather", id: `${lat},${lon}` },
      ],
    }),
    getWeatherByCity: builder.query<WeatherData, CityQueryArg>({
      query: ({ city }) => weatherEndpoints.byCity(city),
      keepUnusedDataFor: 600,
      providesTags: (_result, _error, { city }) => [
        { type: "Weather", id: city.toLowerCase() },
      ],
    }),
  }),
})

export const { useGetWeatherByLatLonQuery, useGetWeatherByCityQuery } =
  weatherApi
