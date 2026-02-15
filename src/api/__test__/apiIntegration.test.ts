import { describe, it, expect, beforeEach } from "vitest"
import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "../baseApi"
import { weatherApi } from "../weatherApi"
import { forecastApi } from "../forecastApi"
import { airPollutionApi } from "../airPollutionApi"
import weatherUiReducer from "../../features/weather/slice"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createTestStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      weatherUi: weatherUiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

// ---------------------------------------------------------------------------
// weatherApi
// ---------------------------------------------------------------------------

describe("weatherApi integration", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("getWeatherByLatLon returns data on success", async () => {
    const mockData = { name: "Amsterdam", main: { temp: 20 } }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const store = createTestStore()
    const result = await store.dispatch(
      weatherApi.endpoints.getWeatherByLatLon.initiate({
        lat: 52.37,
        lon: 4.89,
      }),
    )

    expect(result.data).toEqual(mockData)
    expect(result.isSuccess).toBe(true)
  })

  it("getWeatherByCity returns data on success", async () => {
    const mockData = { name: "Berlin", main: { temp: 15 } }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const store = createTestStore()
    const result = await store.dispatch(
      weatherApi.endpoints.getWeatherByCity.initiate({ city: "Berlin" }),
    )

    expect(result.data).toEqual(mockData)
    expect(result.isSuccess).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// forecastApi
// ---------------------------------------------------------------------------

describe("forecastApi integration", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("getForecastByLatLon returns data on success", async () => {
    const mockData = { list: [{ dt: 1 }] }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const store = createTestStore()
    const result = await store.dispatch(
      forecastApi.endpoints.getForecastByLatLon.initiate({
        lat: 48.85,
        lon: 2.35,
      }),
    )

    expect(result.data).toEqual(mockData)
    expect(result.isSuccess).toBe(true)
  })

  it("getForecastByCity returns data on success", async () => {
    const mockData = { list: [{ dt: 2 }] }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const store = createTestStore()
    const result = await store.dispatch(
      forecastApi.endpoints.getForecastByCity.initiate({ city: "Paris" }),
    )

    expect(result.data).toEqual(mockData)
    expect(result.isSuccess).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// airPollutionApi
// ---------------------------------------------------------------------------

describe("airPollutionApi integration", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("getAirPollutionByLatLon returns data on success", async () => {
    const mockData = { list: [{ main: { aqi: 2 } }] }
    fetchMock.mockResponseOnce(JSON.stringify(mockData))

    const store = createTestStore()
    const result = await store.dispatch(
      airPollutionApi.endpoints.getAirPollutionByLatLon.initiate({
        lat: 40.71,
        lon: -74.0,
      }),
    )

    expect(result.data).toEqual(mockData)
    expect(result.isSuccess).toBe(true)
  })

  describe("getAirPollutionByCity (queryFn)", () => {
    it("returns error when city is empty/whitespace", async () => {
      const store = createTestStore()
      const result = await store.dispatch(
        airPollutionApi.endpoints.getAirPollutionByCity.initiate({
          city: "   ",
        }),
      )

      expect(result.isError).toBe(true)
      expect(result.error).toEqual(
        expect.objectContaining({ status: 400, data: "Invalid city" }),
      )
    })

    it("geocodes city then fetches air pollution on success", async () => {
      // First call: geo lookup returns coordinates
      fetchMock.mockResponseOnce(JSON.stringify([{ lat: 52.37, lon: 4.89 }]))
      // Second call: air pollution data
      fetchMock.mockResponseOnce(
        JSON.stringify({ list: [{ main: { aqi: 3 } }] }),
      )

      const store = createTestStore()
      const result = await store.dispatch(
        airPollutionApi.endpoints.getAirPollutionByCity.initiate({
          city: "Amsterdam",
        }),
      )

      expect(result.data).toEqual({ list: [{ main: { aqi: 3 } }] })
      expect(result.isSuccess).toBe(true)
    })

    it("returns error when geo lookup fails", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "geo lookup failed" }),
        { status: 500 },
      )

      const store = createTestStore()
      const result = await store.dispatch(
        airPollutionApi.endpoints.getAirPollutionByCity.initiate({
          city: "InvalidCity",
        }),
      )

      expect(result.isError).toBe(true)
    })

    it("returns 404 when geo lookup returns empty array", async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]))

      const store = createTestStore()
      const result = await store.dispatch(
        airPollutionApi.endpoints.getAirPollutionByCity.initiate({
          city: "UnknownPlace",
        }),
      )

      expect(result.isError).toBe(true)
      expect(result.error).toEqual(
        expect.objectContaining({ status: 404, data: "Invalid city" }),
      )
    })

    it("returns error when pollution fetch fails after successful geo", async () => {
      // Geo lookup succeeds
      fetchMock.mockResponseOnce(JSON.stringify([{ lat: 52.37, lon: 4.89 }]))
      // Pollution fetch fails
      fetchMock.mockResponseOnce(
        JSON.stringify({ message: "service unavailable" }),
        { status: 503 },
      )

      const store = createTestStore()
      const result = await store.dispatch(
        airPollutionApi.endpoints.getAirPollutionByCity.initiate({
          city: "Amsterdam",
        }),
      )

      expect(result.isError).toBe(true)
    })
  })
})

// ---------------------------------------------------------------------------
// baseApi – baseQueryWithApiKey
// ---------------------------------------------------------------------------

describe("baseApi – baseQueryWithApiKey", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("appends API key to URL with existing query params", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ name: "Test" }))

    const store = createTestStore()
    await store.dispatch(
      weatherApi.endpoints.getWeatherByLatLon.initiate({ lat: 1, lon: 2 }),
    )

    // The fetch URL should contain &appid= (since the url already has ?)
    const fetchCall = fetchMock.mock.calls[0]?.[0]
    const fetchUrl =
      typeof fetchCall === "string" ? fetchCall : (fetchCall as Request).url
    expect(fetchUrl).toContain("&appid=")
  })

  it("extracts error message from API error response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "city not found" }), {
      status: 404,
    })

    const store = createTestStore()
    const result = await store.dispatch(
      weatherApi.endpoints.getWeatherByCity.initiate({ city: "xyz123" }),
    )

    expect(result.isError).toBe(true)
    expect(result.error).toEqual(
      expect.objectContaining({ data: "city not found" }),
    )
  })

  it("uses fallback error message when API error has no message field", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 })

    const store = createTestStore()
    const result = await store.dispatch(
      weatherApi.endpoints.getWeatherByCity.initiate({ city: "failcity" }),
    )

    expect(result.isError).toBe(true)
    expect(result.error).toEqual(
      expect.objectContaining({ data: "An unexpected error occurred" }),
    )
  })
})
