import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { Provider } from "react-redux"
import { WeatherProvider } from "../../providers/weatherProvider"
import Search from "../Search"
import * as WeatherService from "../../services/weather"
import * as ForecastService from "../../services/forecast"
import * as AirPollutionService from "../../services/airPollution"
import * as Utils from "../../utils/index"
import { weatherServiceMockedResponse } from "../../services/__test__/weather.test"
import { forecastServiceMockedResponse } from "../../services/__test__/forecast.test"
import { fetchAirPolutionMockedResponse } from "../../services/__test__/airPollution.test"
import { store } from "../../store/store"

interface WrapperProps {
  children: React.ReactNode
}

const wrapper: React.FC<WrapperProps> = ({ children }) => (
  <Provider store={store}>
    <WeatherProvider>{children}</WeatherProvider>
  </Provider>
)

const setupMocks = () => {
  vi.spyOn(Utils, "getLocalStorageItem").mockImplementation(() => {
    return { lat: 100, lon: 100 }
  })

  vi.spyOn(Utils, "getBrowserGeoPosition").mockImplementation(() => {
    return Promise.resolve({ latitude: 100, longitude: 100 })
  })

  vi.spyOn(WeatherService, "getWeatherByLatLon").mockImplementation(() => {
    return Promise.resolve({ ...weatherServiceMockedResponse })
  })

  vi.spyOn(AirPollutionService, "getAirPollutionByLatLon").mockImplementation(
    () => {
      return Promise.resolve({ ...fetchAirPolutionMockedResponse })
    },
  )

  vi.spyOn(ForecastService, "getForecastByLatLon").mockImplementation(() => {
    return Promise.resolve({ ...forecastServiceMockedResponse })
  })

  vi.spyOn(WeatherService, "getWeatherByCity").mockImplementation(() => {
    return Promise.resolve({ ...weatherServiceMockedResponse })
  })

  vi.spyOn(ForecastService, "getForecastByCity").mockImplementation(() => {
    return Promise.resolve({ ...forecastServiceMockedResponse })
  })

  vi.spyOn(AirPollutionService, "getAirPollutionByCity").mockImplementation(
    () => {
      return Promise.resolve({ ...fetchAirPolutionMockedResponse })
    },
  )
}

describe("Search", () => {
  beforeEach(() => {
    setupMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders search input and button", () => {
    render(<Search />, { wrapper })

    expect(screen.getByTestId("input-search-by-city")).toBeVisible()
    expect(screen.getByTestId("btn-search")).toBeVisible()
  })

  it("updates the input value on change", () => {
    render(<Search />, { wrapper })

    const input = screen.getByTestId("input-search-by-city") as HTMLInputElement
    fireEvent.change(input, { target: { value: "Amsterdam" } })

    expect(input.value).toBe("Amsterdam")
  })

  it("triggers search on Enter key press", async () => {
    render(<Search />, { wrapper })

    const input = screen.getByTestId("input-search-by-city")
    fireEvent.change(input, { target: { value: "Berlin" } })

    await act(async () => {
      fireEvent.keyDown(document, { key: "Enter" })
    })

    expect(WeatherService.getWeatherByCity).toHaveBeenCalled()
  })

  it("does not trigger search on non-Enter key press", async () => {
    render(<Search />, { wrapper })

    const input = screen.getByTestId("input-search-by-city")
    fireEvent.change(input, { target: { value: "Berlin" } })

    await act(async () => {
      fireEvent.keyDown(document, { key: "Escape" })
    })

    expect(WeatherService.getWeatherByCity).not.toHaveBeenCalled()
  })

  it("triggers search on button click via form submit", async () => {
    render(<Search />, { wrapper })

    const input = screen.getByTestId("input-search-by-city")
    const button = screen.getByTestId("btn-search")

    fireEvent.change(input, { target: { value: "London" } })

    await act(async () => {
      fireEvent.click(button)
    })

    expect(WeatherService.getWeatherByCity).toHaveBeenCalled()
  })
})
