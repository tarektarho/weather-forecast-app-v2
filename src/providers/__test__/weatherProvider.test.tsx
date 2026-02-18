import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { WeatherProvider } from "../weatherProvider"
import { useWeather } from "../weatherContext"
import { baseApi } from "../../api/baseApi"
import weatherUiReducer from "../../features/weather/slice"
import * as UrlModule from "../../browser/url"
import * as StorageModule from "../../browser/storage"
import * as GeoModule from "../../browser/geolocation"
import * as PositionStorageModule from "../../features/api/services/positionStorage"
import * as ShareLinkModule from "../../features/api/services/shareLink"
import * as Constants from "../../utils/constants"
import { useGetWeatherByCityQuery } from "../../api/weatherApi"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("../../browser/url", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof UrlModule
  return { ...actual, getURLParam: vi.fn().mockReturnValue(null) }
})

vi.mock("../../browser/storage", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof StorageModule
  return {
    ...actual,
    getLocalStorageItem: vi.fn().mockReturnValue(null),
    setLocalStorageItem: vi.fn(),
  }
})

vi.mock("../../browser/geolocation", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof GeoModule
  return { ...actual, getBrowserGeoPosition: vi.fn() }
})

vi.mock(
  "../../features/api/services/positionStorage",
  async (importOriginal) => {
    const actual = (await importOriginal()) as typeof PositionStorageModule
    return { ...actual, savePosition: vi.fn() }
  },
)

vi.mock("../../features/api/services/shareLink", async (importOriginal) => {
  const actual = (await importOriginal()) as typeof ShareLinkModule
  return { ...actual, placeLinkIntoClipBoard: vi.fn() }
})

vi.mock("../../api/weatherApi", () => ({
  useGetWeatherByLatLonQuery: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: true,
    refetch: () => {},
  })),
  useGetWeatherByCityQuery: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: true,
    refetch: () => {},
  })),
}))

vi.mock("../../api/forecastApi", () => ({
  useGetForecastByLatLonQuery: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: true,
    refetch: () => {},
  })),
  useGetForecastByCityQuery: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: true,
    refetch: () => {},
  })),
}))

vi.mock("../../api/airPollutionApi", () => ({
  useGetAirPollutionByLatLonQuery: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: true,
    refetch: () => {},
  })),
  useGetAirPollutionByCityQuery: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    isUninitialized: true,
    refetch: () => {},
  })),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a fresh Redux store for each test. */
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

/**
 * Consumer component that exposes context values for assertions.
 * Renders buttons so we can trigger context actions from tests.
 */
function TestConsumer() {
  const ctx = useWeather()
  return (
    <div>
      <span data-testid="city">{ctx.city}</span>
      <span data-testid="modal">{String(ctx.modal)}</span>
      <span data-testid="error">{ctx.error ?? ""}</span>
      <span data-testid="info">{ctx.info ?? ""}</span>
      <span data-testid="weather-loading">
        {String(ctx.weatherData.isLoading)}
      </span>
      <input
        data-testid="city-input"
        value={ctx.city}
        onChange={(e) => ctx.setCity(e.target.value)}
      />
      <button data-testid="search" onClick={() => ctx.searchByCity("Berlin")}>
        Search
      </button>
      <button data-testid="hide-modal" onClick={ctx.hideModal}>
        Hide Modal
      </button>
      <button data-testid="hide-error" onClick={ctx.hideError}>
        Hide Error
      </button>
      <button data-testid="copy-url" onClick={ctx.copyShareUrl}>
        Copy URL
      </button>
      <button
        data-testid="set-error"
        onClick={() => ctx.setError("custom error")}
      >
        Set Error
      </button>
      <button data-testid="set-info" onClick={() => ctx.setInfo("custom info")}>
        Set Info
      </button>
    </div>
  )
}

function renderWithProvider() {
  const store = createTestStore()
  return render(
    <Provider store={store}>
      <WeatherProvider>
        <TestConsumer />
      </WeatherProvider>
    </Provider>,
  )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()

  // Default: no URL params, no localStorage, geolocation never resolves
  vi.mocked(UrlModule.getURLParam).mockReturnValue(null)
  vi.mocked(StorageModule.getLocalStorageItem).mockReturnValue(null)
  vi.mocked(GeoModule.getBrowserGeoPosition).mockReturnValue(
    new Promise(() => {}),
  )
})

describe("WeatherProvider", () => {
  it("renders children", () => {
    renderWithProvider()
    expect(screen.getByTestId("city")).toBeInTheDocument()
  })

  it("has empty city by default", () => {
    renderWithProvider()
    expect(screen.getByTestId("city").textContent).toBe("")
  })

  it("shows modal as true by default", () => {
    renderWithProvider()
    expect(screen.getByTestId("modal").textContent).toBe("true")
  })

  it("has no error or info initially", () => {
    renderWithProvider()
    expect(screen.getByTestId("error").textContent).toBe("")
    expect(screen.getByTestId("info").textContent).toBe("")
  })
})

describe("resolveInitialCoords – URL params", () => {
  it("reads lat/lon from URL params synchronously", () => {
    vi.mocked(UrlModule.getURLParam).mockImplementation((param: string) => {
      if (param === Constants.URL_PARAM_LAT) return "52.37"
      if (param === Constants.URL_PARAM_LON) return "4.89"
      return null
    })

    renderWithProvider()

    // Should NOT trigger browser geolocation when URL params are present
    expect(GeoModule.getBrowserGeoPosition).not.toHaveBeenCalled()
  })

  it("falls through to geolocation when URL params are invalid", () => {
    vi.mocked(UrlModule.getURLParam).mockImplementation((param: string) => {
      if (param === Constants.URL_PARAM_LAT) return "999"
      if (param === Constants.URL_PARAM_LON) return "abc"
      return null
    })

    renderWithProvider()

    // Invalid coords should be ignored → fallback to geolocation
    expect(GeoModule.getBrowserGeoPosition).toHaveBeenCalledTimes(1)
  })
})

describe("resolveInitialCoords – localStorage", () => {
  it("reads lat/lon from localStorage when no URL params", () => {
    vi.mocked(StorageModule.getLocalStorageItem).mockImplementation(
      (key: string) => {
        if (key === Constants.LOCAL_STORAGE_KEY_GPS_POSITION) {
          return { lat: 48.85, lon: 2.35 }
        }
        return null
      },
    )

    renderWithProvider()

    expect(GeoModule.getBrowserGeoPosition).not.toHaveBeenCalled()
  })

  it("falls through to geolocation when localStorage coords are invalid", () => {
    vi.mocked(StorageModule.getLocalStorageItem).mockImplementation(
      (key: string) => {
        if (key === Constants.LOCAL_STORAGE_KEY_GPS_POSITION) {
          return { lat: 999, lon: -999 }
        }
        return null
      },
    )

    renderWithProvider()

    expect(GeoModule.getBrowserGeoPosition).toHaveBeenCalledTimes(1)
  })
})

describe("geolocation effect", () => {
  it("calls getBrowserGeoPosition when no coords available", () => {
    renderWithProvider()
    expect(GeoModule.getBrowserGeoPosition).toHaveBeenCalledTimes(1)
  })

  it("sets lat/lon and saves position on successful geolocation", async () => {
    vi.mocked(GeoModule.getBrowserGeoPosition).mockResolvedValue({
      latitude: 40.71,
      longitude: -74.0,
    })

    renderWithProvider()

    await waitFor(() => {
      expect(PositionStorageModule.savePosition).toHaveBeenCalledWith(
        40.71,
        -74.0,
      )
    })
  })

  it("sets error when geolocation fails with an Error", async () => {
    vi.mocked(GeoModule.getBrowserGeoPosition).mockRejectedValue(
      new Error("User denied geolocation"),
    )

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe(
        "User denied geolocation",
      )
    })
  })

  it("sets fallback error when geolocation fails with non-Error", async () => {
    vi.mocked(GeoModule.getBrowserGeoPosition).mockRejectedValue("unknown")

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe(
        Constants.ERROR_BROWSER_GEOLOCATION_OFF,
      )
    })
  })
})

describe("hideModal", () => {
  it("toggles modal to false and saves to localStorage", async () => {
    const user = userEvent.setup()
    renderWithProvider()

    expect(screen.getByTestId("modal").textContent).toBe("true")

    await user.click(screen.getByTestId("hide-modal"))

    expect(screen.getByTestId("modal").textContent).toBe("false")
    expect(StorageModule.setLocalStorageItem).toHaveBeenCalledWith(
      Constants.LOCAL_STORAGE_KEY_WELCOME_MODAL,
      true,
    )
  })
})

describe("hideError", () => {
  it("clears the error state", async () => {
    const user = userEvent.setup()
    renderWithProvider()

    // Set an error first
    await user.click(screen.getByTestId("set-error"))
    expect(screen.getByTestId("error").textContent).toBe("custom error")

    // Hide it
    await user.click(screen.getByTestId("hide-error"))
    expect(screen.getByTestId("error").textContent).toBe("")
  })
})

describe("searchByCity", () => {
  it("triggers a city search and calls the city query hook", async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("search"))

    // After clicking search with "Berlin", the city query hook should be called
    // with { city: "Berlin" } and skip: false
    await waitFor(() => {
      const calls = vi.mocked(useGetWeatherByCityQuery).mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[0]).toEqual({ city: "Berlin" })
      expect(lastCall[1]).toEqual({ skip: false })
    })
  })
})

describe("copyShareUrl", () => {
  it("sets info message on success", async () => {
    vi.mocked(ShareLinkModule.placeLinkIntoClipBoard).mockResolvedValue(
      undefined,
    )
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("copy-url"))

    await waitFor(() => {
      expect(screen.getByTestId("info").textContent).toBe(
        Constants.MESSAGE_URL_COPIED,
      )
    })
  })

  it("sets error message on failure (string rejection)", async () => {
    vi.mocked(ShareLinkModule.placeLinkIntoClipBoard).mockRejectedValue(
      "clipboard failed",
    )
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("copy-url"))

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("clipboard failed")
    })
  })

  it("sets generic error on non-string rejection", async () => {
    vi.mocked(ShareLinkModule.placeLinkIntoClipBoard).mockRejectedValue(42)
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("copy-url"))

    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Failed to copy URL")
    })
  })

  it("passes active weatherData coord to placeLinkIntoClipBoard", async () => {
    // Mock weatherByLatLon to return data with coord
    const { useGetWeatherByLatLonQuery } = await import("../../api/weatherApi")
    vi.mocked(useGetWeatherByLatLonQuery).mockReturnValue({
      data: { coord: { lat: 51.51, lon: -0.13 } },
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      isError: false,
      isUninitialized: false,
      refetch: () => {},
    } as unknown as ReturnType<typeof useGetWeatherByLatLonQuery>)

    vi.mocked(ShareLinkModule.placeLinkIntoClipBoard).mockResolvedValue(
      undefined,
    )

    // Provide valid coords so the hook isn't skipped
    vi.mocked(StorageModule.getLocalStorageItem).mockImplementation(
      (key: string) => {
        if (key === Constants.LOCAL_STORAGE_KEY_GPS_POSITION) {
          return { lat: 52, lon: 5 }
        }
        return null
      },
    )

    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("copy-url"))

    await waitFor(() => {
      expect(ShareLinkModule.placeLinkIntoClipBoard).toHaveBeenCalledWith(
        51.51,
        -0.13,
      )
    })
  })

  it("calls placeLinkIntoClipBoard with undefined when no weather data", async () => {
    vi.mocked(ShareLinkModule.placeLinkIntoClipBoard).mockResolvedValue(
      undefined,
    )
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("copy-url"))

    await waitFor(() => {
      expect(ShareLinkModule.placeLinkIntoClipBoard).toHaveBeenCalledWith(
        undefined,
        undefined,
      )
    })
  })
})

describe("setError / setInfo", () => {
  it("exposes setError to consumers", async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("set-error"))
    expect(screen.getByTestId("error").textContent).toBe("custom error")
  })

  it("exposes setInfo to consumers", async () => {
    const user = userEvent.setup()
    renderWithProvider()

    await user.click(screen.getByTestId("set-info"))
    expect(screen.getByTestId("info").textContent).toBe("custom info")
  })
})
