import React from "react"
import { renderHook } from "@testing-library/react"
import { Provider } from "react-redux"
import { useWeather, ERROR_CONTEXT_OUTSIDE } from "../weatherContext"
import { WeatherProvider } from "../weatherProvider"
import { store } from "../../store/store"
import * as Utils from "../../utils/index"
import * as WeatherService from "../../services/weather"
import * as ForecastService from "../../services/forecast"
import * as AirPollutionService from "../../services/airPollution"
import { weatherServiceMockedResponse } from "../../services/__test__/weather.test"
import { forecastServiceMockedResponse } from "../../services/__test__/forecast.test"
import { fetchAirPolutionMockedResponse } from "../../services/__test__/airPollution.test"

describe("WeatherContext", () => {
  it("throws an error when useWeather is used outside WeatherProvider", () => {
    // Suppress console.error for the expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      renderHook(() => useWeather())
    }).toThrow(ERROR_CONTEXT_OUTSIDE)

    spy.mockRestore()
  })

  it("returns context value when used inside WeatherProvider", () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockImplementation(() => {
      return { lat: 100, lon: 100 }
    })

    vi.spyOn(Utils, "getBrowserGeoPosition").mockImplementation(() => {
      return Promise.resolve({ latitude: 100, longitude: 100 })
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

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Provider store={store}>
        <WeatherProvider>{children}</WeatherProvider>
      </Provider>
    )

    const { result } = renderHook(() => useWeather(), { wrapper })

    expect(result.current).toBeDefined()
    expect(result.current.searchByCity).toBeDefined()
    expect(result.current.hideModal).toBeDefined()
    expect(result.current.hideError).toBeDefined()
    expect(result.current.copyShareUrl).toBeDefined()
  })
})
