import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react"
import { API_KEY, BASE_URL_WEATHER } from "../utils/constants"
import type { ApiErrorData } from "./types"
import { TAG_TYPES } from "./tags"

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

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithApiKey,
  tagTypes: TAG_TYPES,
  // Default: keep unused cache entries for 5 minutes (300 s)
  keepUnusedDataFor: 300,
  endpoints: () => ({}),
})
