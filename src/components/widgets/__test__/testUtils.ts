import type {
  QueryResult,
  WeatherContextValue,
} from "../../../providers/weatherContext"

/**
 * Creates a mock QueryResult for use in test context values.
 */
export function mockQueryResult<T>(
  overrides: Partial<QueryResult<T>> = {},
): QueryResult<T> {
  return {
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: true,
    ...overrides,
  }
}

export const weatherContextMockedData: Omit<
  WeatherContextValue,
  "setCity" | "setInfo" | "setError"
> = {
  forecastData: mockQueryResult({ isLoading: true, isFetching: true }),
  weatherData: mockQueryResult({ isLoading: true, isFetching: true }),
  airPollutionData: mockQueryResult({ isLoading: true, isFetching: true }),
  city: "",
  searchByCity: (): void => {},
  copyShareUrl: (): void => {},
  modal: false,
  hideModal: (): void => {},
  error: undefined,
  hideError: (): void => {},
  info: undefined,
}
