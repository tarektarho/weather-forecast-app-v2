import { baseApi } from "./baseApi"
import { weatherEndpoints } from "./endpoints"
import type WeatherData from "../types/weather"

export const weatherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeatherByLatLon: builder.query<
      WeatherData,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) => weatherEndpoints.byLatLon(lat, lon),
      providesTags: (_result, _error, { lat, lon }) => [
        { type: "Weather", id: `${lat},${lon}` },
      ],
    }),
    getWeatherByCity: builder.query<WeatherData, { city: string }>({
      query: ({ city }) => weatherEndpoints.byCity(city),
      providesTags: (_result, _error, { city }) => [
        { type: "Weather", id: city.toLowerCase() },
      ],
    }),
  }),
})

export const { useGetWeatherByLatLonQuery, useGetWeatherByCityQuery } =
  weatherApi
