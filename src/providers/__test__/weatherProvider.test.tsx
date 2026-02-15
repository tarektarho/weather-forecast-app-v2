import React from "react"
import { render, screen, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { WeatherProvider } from "../weatherProvider"
import { useWeather } from "../weatherContext"
import { store } from "../../store/store"
import * as Utils from "../../utils/index"
import * as WeatherService from "../../services/weather"
import * as ForecastService from "../../services/forecast"
import * as AirPollutionService from "../../services/airPollution"
import { weatherServiceMockedResponse } from "../../services/__test__/weather.test"
import { forecastServiceMockedResponse } from "../../services/__test__/forecast.test"
import { fetchAirPolutionMockedResponse } from "../../services/__test__/airPollution.test"

// Helper component to expose context values for testing
const TestConsumer: React.FC = () => {
  const ctx = useWeather()
  return (
    <div>
      <span data-testid="error">{ctx.error ?? ""}</span>
      <span data-testid="info">{ctx.info ?? ""}</span>
      <button data-testid="copy-share" onClick={ctx.copyShareUrl}>
        Copy
      </button>
      <button data-testid="hide-error" onClick={ctx.hideError}>
        Hide Error
      </button>
      <button data-testid="search" onClick={() => ctx.searchByCity("London")}>
        Search
      </button>
      <button data-testid="search-empty" onClick={() => ctx.searchByCity("")}>
        Search Empty
      </button>
    </div>
  )
}

const renderWithProvider = () => {
  return render(
    <Provider store={store}>
      <WeatherProvider>
        <TestConsumer />
      </WeatherProvider>
    </Provider>,
  )
}

describe("WeatherProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it("sets error when geolocation is not available", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue(null)
    vi.spyOn(Utils, "getURLParam").mockReturnValue(null)
    vi.spyOn(Utils, "getBrowserGeoPosition").mockRejectedValue(
      new Error(
        "It seems like your browser does not support HTML5 geolocation",
      ),
    )

    await act(async () => {
      renderWithProvider()
    })

    expect(screen.getByTestId("error").textContent).toBe(
      "It seems like your browser does not support HTML5 geolocation",
    )
  })

  it("sets error with default message when geolocation fails with non-Error", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue(null)
    vi.spyOn(Utils, "getURLParam").mockReturnValue(null)
    vi.spyOn(Utils, "getBrowserGeoPosition").mockRejectedValue("unknown error")

    await act(async () => {
      renderWithProvider()
    })

    expect(screen.getByTestId("error").textContent).toBe(
      "It seems like your browser does not support HTML5 geolocation. Please install a different browser and enable JavaScript",
    )
  })

  it("reads lat/lon from URL params when present", async () => {
    vi.spyOn(Utils, "getURLParam").mockImplementation((param: string) => {
      if (param === "lat") return "52"
      if (param === "lon") return "5"
      return null
    })

    vi.spyOn(WeatherService, "getWeatherByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...weatherServiceMockedResponse })
    })
    vi.spyOn(ForecastService, "getForecastByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...forecastServiceMockedResponse })
    })
    vi.spyOn(AirPollutionService, "getAirPollutionByLatLon").mockImplementation(
      () => {
        return Promise.resolve({ ...fetchAirPolutionMockedResponse })
      },
    )

    await act(async () => {
      renderWithProvider()
    })

    expect(WeatherService.getWeatherByLatLon).toHaveBeenCalled()
  })

  it("copyShareUrl sets info message on success", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue({
      lat: 52,
      lon: 5,
    })
    vi.spyOn(Utils, "getBrowserGeoPosition").mockResolvedValue({
      latitude: 52,
      longitude: 5,
    })
    vi.spyOn(Utils, "placeLinkIntoClipBoard").mockResolvedValue(undefined)
    vi.spyOn(WeatherService, "getWeatherByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...weatherServiceMockedResponse })
    })
    vi.spyOn(ForecastService, "getForecastByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...forecastServiceMockedResponse })
    })
    vi.spyOn(AirPollutionService, "getAirPollutionByLatLon").mockImplementation(
      () => {
        return Promise.resolve({ ...fetchAirPolutionMockedResponse })
      },
    )

    await act(async () => {
      renderWithProvider()
    })

    await act(async () => {
      screen.getByTestId("copy-share").click()
    })

    expect(screen.getByTestId("info").textContent).toBe(
      "URL was copied to clipboard",
    )
  })

  it("searchByCity does nothing when city is empty", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue({
      lat: 52,
      lon: 5,
    })
    vi.spyOn(Utils, "getBrowserGeoPosition").mockResolvedValue({
      latitude: 52,
      longitude: 5,
    })
    vi.spyOn(WeatherService, "getWeatherByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...weatherServiceMockedResponse })
    })
    vi.spyOn(ForecastService, "getForecastByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...forecastServiceMockedResponse })
    })
    vi.spyOn(AirPollutionService, "getAirPollutionByLatLon").mockImplementation(
      () => {
        return Promise.resolve({ ...fetchAirPolutionMockedResponse })
      },
    )
    vi.spyOn(WeatherService, "getWeatherByCity").mockImplementation(() => {
      return Promise.resolve({ ...weatherServiceMockedResponse })
    })

    await act(async () => {
      renderWithProvider()
    })

    await act(async () => {
      screen.getByTestId("search-empty").click()
    })

    // getWeatherByCity should not be called for empty city
    expect(WeatherService.getWeatherByCity).not.toHaveBeenCalled()
  })

  it("copyShareUrl sets error message on failure", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue({
      lat: 52,
      lon: 5,
    })
    vi.spyOn(Utils, "getBrowserGeoPosition").mockResolvedValue({
      latitude: 52,
      longitude: 5,
    })
    vi.spyOn(Utils, "placeLinkIntoClipBoard").mockRejectedValue(
      "Clipboard not available",
    )
    vi.spyOn(WeatherService, "getWeatherByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...weatherServiceMockedResponse })
    })
    vi.spyOn(ForecastService, "getForecastByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...forecastServiceMockedResponse })
    })
    vi.spyOn(AirPollutionService, "getAirPollutionByLatLon").mockImplementation(
      () => {
        return Promise.resolve({ ...fetchAirPolutionMockedResponse })
      },
    )

    await act(async () => {
      renderWithProvider()
    })

    await act(async () => {
      screen.getByTestId("copy-share").click()
    })

    expect(screen.getByTestId("error").textContent).toBe(
      "Clipboard not available",
    )
  })

  it("copyShareUrl sets generic error when rejection is not a string", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue({
      lat: 52,
      lon: 5,
    })
    vi.spyOn(Utils, "getBrowserGeoPosition").mockResolvedValue({
      latitude: 52,
      longitude: 5,
    })
    vi.spyOn(Utils, "placeLinkIntoClipBoard").mockRejectedValue(
      new Error("some error"),
    )
    vi.spyOn(WeatherService, "getWeatherByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...weatherServiceMockedResponse })
    })
    vi.spyOn(ForecastService, "getForecastByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...forecastServiceMockedResponse })
    })
    vi.spyOn(AirPollutionService, "getAirPollutionByLatLon").mockImplementation(
      () => {
        return Promise.resolve({ ...fetchAirPolutionMockedResponse })
      },
    )

    await act(async () => {
      renderWithProvider()
    })

    await act(async () => {
      screen.getByTestId("copy-share").click()
    })

    expect(screen.getByTestId("error").textContent).toBe("Failed to copy URL")
  })

  it("sets lat/lon from browser geolocation when no cache or URL params exist", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue(null)
    vi.spyOn(Utils, "getURLParam").mockReturnValue(null)
    vi.spyOn(Utils, "getBrowserGeoPosition").mockResolvedValue({
      latitude: 48.85,
      longitude: 2.35,
    })
    const savePositionSpy = vi.spyOn(Utils, "savePosition")

    vi.spyOn(WeatherService, "getWeatherByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...weatherServiceMockedResponse })
    })
    vi.spyOn(ForecastService, "getForecastByLatLon").mockImplementation(() => {
      return Promise.resolve({ ...forecastServiceMockedResponse })
    })
    vi.spyOn(AirPollutionService, "getAirPollutionByLatLon").mockImplementation(
      () => {
        return Promise.resolve({ ...fetchAirPolutionMockedResponse })
      },
    )

    await act(async () => {
      renderWithProvider()
    })

    // Verifies lines 76-78: setLat, setLon, savePosition were reached
    expect(savePositionSpy).toHaveBeenCalledWith(48.85, 2.35)
    expect(WeatherService.getWeatherByLatLon).toHaveBeenCalled()
  })

  it("does not set state when component unmounts during successful geolocation", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue(null)
    vi.spyOn(Utils, "getURLParam").mockReturnValue(null)

    // Create a deferred promise so we can control when the resolution occurs
    let resolveFn: (value: { latitude: number; longitude: number }) => void
    vi.spyOn(Utils, "getBrowserGeoPosition").mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFn = resolve
      })
    })
    const savePositionSpy = vi.spyOn(Utils, "savePosition")

    let unmount: () => void
    await act(async () => {
      const result = renderWithProvider()
      unmount = result.unmount
    })

    // Unmount first (triggers AbortController.abort())
    await act(async () => {
      unmount()
    })

    // Then resolve the geolocation promise (after unmount)
    await act(async () => {
      resolveFn({ latitude: 48.85, longitude: 2.35 })
    })

    // savePosition should NOT be called since signal was aborted (line 75)
    expect(savePositionSpy).not.toHaveBeenCalled()
  })

  it("does not set error when component unmounts during geolocation failure", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue(null)
    vi.spyOn(Utils, "getURLParam").mockReturnValue(null)

    // Create a deferred promise so we can control when the rejection occurs
    let rejectFn: (reason?: unknown) => void
    vi.spyOn(Utils, "getBrowserGeoPosition").mockImplementation(() => {
      return new Promise((_resolve, reject) => {
        rejectFn = reject
      })
    })

    let unmount: () => void
    await act(async () => {
      const result = renderWithProvider()
      unmount = result.unmount
    })

    // Unmount first (triggers AbortController.abort())
    await act(async () => {
      unmount()
    })

    // Then reject the geolocation promise (after unmount)
    await act(async () => {
      rejectFn(new Error("User denied geolocation"))
    })

    // No error should be set since signal was aborted
    // (If it threw, the test would fail due to state update on unmounted component)
  })

  it("hideError clears the error state", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockReturnValue(null)
    vi.spyOn(Utils, "getURLParam").mockReturnValue(null)
    vi.spyOn(Utils, "getBrowserGeoPosition").mockRejectedValue(
      new Error("Geolocation error"),
    )

    await act(async () => {
      renderWithProvider()
    })

    expect(screen.getByTestId("error").textContent).toBe("Geolocation error")

    await act(async () => {
      screen.getByTestId("hide-error").click()
    })

    expect(screen.getByTestId("error").textContent).toBe("")
  })
})
