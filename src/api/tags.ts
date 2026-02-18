/**
 * Base API created with RTK Query. Individual endpoint files inject their
 * endpoints into this API using `baseApi.injectEndpoints()`.
 */
/** Cache tag types used by providesTags / invalidatesTags across endpoints. */
export const TAG_TYPES = ["Weather", "Forecast", "AirPollution"] as const
