import { baseApi } from "./baseApi"
import { airPollutionEndpoints, geoEndpoints } from "./endpoints"
import type AirPollutionData from "../types/airPollution"

export const airPollutionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAirPollutionByLatLon: builder.query<
      AirPollutionData,
      { lat: number; lon: number }
    >({
      query: ({ lat, lon }) => airPollutionEndpoints.byLatLon(lat, lon),
      providesTags: (_result, _error, { lat, lon }) => [
        { type: "AirPollution", id: `${lat},${lon}` },
      ],
    }),
    getAirPollutionByCity: builder.query<AirPollutionData, { city: string }>({
      providesTags: (_result, _error, { city }) => [
        { type: "AirPollution", id: city.toLowerCase() },
      ],
      queryFn: async ({ city }, _queryApi, _extraOptions, fetchWithBQ) => {
        const trimmedCity = city.trim()
        if (!trimmedCity) {
          return { error: { status: 400, data: "Invalid city" } }
        }

        // Step 1: Geocode city → lat/lon using the geo URL
        const geoResult = await fetchWithBQ(
          geoEndpoints.directByCity(trimmedCity),
        )
        if (geoResult.error) {
          return { error: geoResult.error }
        }

        const geoData = geoResult.data as Array<{ lat: number; lon: number }>
        const [firstResult] = geoData
        if (!firstResult) {
          return { error: { status: 404, data: "Invalid city" } }
        }

        // Step 2: Fetch air pollution using the resolved coordinates
        const pollutionResult = await fetchWithBQ(
          airPollutionEndpoints.byLatLon(firstResult.lat, firstResult.lon),
        )
        if (pollutionResult.data) {
          return { data: pollutionResult.data as AirPollutionData }
        }
        return {
          error: pollutionResult.error ?? {
            status: 500,
            data: "Unknown error",
          },
        }
      },
    }),
  }),
})

export const {
  useGetAirPollutionByLatLonQuery,
  useGetAirPollutionByCityQuery,
} = airPollutionApi
