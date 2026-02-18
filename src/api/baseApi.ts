import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react"
import { API_KEY, BASE_URL_WEATHER } from "../utils/constants"
import { sleep } from "../utils/index"
import type { ApiErrorData } from "./types"

/**
 * Custom base query that appends the API key and handles error responses
 * consistently with the original fetchData pattern.
 */
const weatherBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL_WEATHER,
})

/**
 * Wrapper around fetchBaseQuery that appends API key, adds artificial delay
 * for loading skeleton UX, and normalises error responses.
 */
const baseQueryWithApiKey: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  // Normalise args to an object so we can manipulate params
  const requestArgs = typeof args === "string" ? { url: args } : { ...args }

  // Append API key to params
  const separator = requestArgs.url.includes("?") ? "&" : "?"
  requestArgs.url = `${requestArgs.url}${separator}appid=${API_KEY}`

  const result = await weatherBaseQuery(requestArgs, api, extraOptions)

  // Artificial delay to keep skeleton UX in sync (mirrors original sleep(300))
  await sleep(300)

  // The OpenWeatherMap API returns 200 for valid responses but may return
  // non-200 with a JSON body containing a "message" field.
  if (result.error) {
    const errorData = result.error.data as ApiErrorData | undefined
    return {
      error: {
        status: result.error.status,
        data: errorData?.message ?? "An unexpected error occurred",
      } as FetchBaseQueryError,
      data: undefined,
      meta: result.meta,
    }
  }

  return result
}

/**
 * Base API created with RTK Query. Individual endpoint files inject their
 * endpoints into this API using `baseApi.injectEndpoints()`.
 */
/** Cache tag types used by providesTags / invalidatesTags across endpoints. */
export const TAG_TYPES = ["Weather", "Forecast", "AirPollution"] as const

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithApiKey,
  tagTypes: TAG_TYPES,
  // Keep unused cache entries for 5 minutes (300 s) before auto-removal
  keepUnusedDataFor: 300,
  endpoints: () => ({}),
})
