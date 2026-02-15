import React from "react"
import { Provider } from "react-redux"
import { WeatherProvider } from "../../providers/weatherProvider"
import Dashboard from "../Dashboard"

import { render, screen, fireEvent, act } from "@testing-library/react"

import { fetchAirPolutionMockedResponse } from "../../services/__test__/airPollution.test"
import { forecastServiceMockedResponse } from "../../services/__test__/forecast.test"
import { weatherServiceMockedResponse } from "../../services/__test__/weather.test"
import * as WeatherService from "../../services/weather"
import * as ForecastService from "../../services/forecast"
import * as AirPollutionService from "../../services/airPollution"
import * as Utils from "../../utils/index"
import { store } from "../../store/store"

export interface WeatherProviderProps {
  children: React.ReactNode
}
const wrapper: React.FC<WeatherProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <WeatherProvider>{children}</WeatherProvider>
    </Provider>
  )
}
describe("Dashboard", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it("hides the welcome modal after clicking continue", async () => {
    // Clearing the localStorage so the modal appear
    localStorage.clear()

    render(<Dashboard />, { wrapper })
    const modalContainer = screen.getByTestId("modal-container") // <div data-testid="modal-container">
    expect(modalContainer).toBeVisible()

    const btnHideModal = screen.getByTestId("hide-modal-btn") // <button data-testid="hide-modal-btn" onClick={() => dispatch(actionAsyncThunk)}> // await API.get
    expect(btnHideModal).toBeVisible()

    await act(async () => {
      await fireEvent.click(btnHideModal)
    })

    expect(modalContainer).not.toBeVisible()
  })

  it("renders an info notification when copyShareUrl succeeds", async () => {
    vi.spyOn(Utils, "getLocalStorageItem").mockImplementation(() => {
      return { lat: 52, lon: 5 }
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
      render(<Dashboard />, { wrapper })
    })

    // Click the share button to trigger copyShareUrl which sets info
    const shareButton = screen.getByAltText("Share")

    await act(async () => {
      fireEvent.click(shareButton)
    })

    // The info notification should now be visible
    const notification = screen.getByTestId("notification")
    expect(notification).toBeVisible()
    expect(notification).toHaveClass("info")
    expect(notification.textContent).toContain("URL was copied to clipboard")

    // Dismiss the info notification to cover hideNotification callback (line 55)
    const closeIcon = screen.getByTestId("close-icon")
    await act(async () => {
      fireEvent.click(closeIcon)
    })

    expect(notification).not.toBeVisible()
  })
})

describe("Search", () => {
  it("search by city and the new data is update in the view", async () => {
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

    // to search by mocks

    vi.spyOn(ForecastService, "getForecastByCity").mockImplementation(() => {
      return Promise.resolve({
        ...forecastServiceMockedResponse,
        city: {
          ...forecastServiceMockedResponse.city,
          name: "Rotterdam",
        },
      })
    })

    vi.spyOn(WeatherService, "getWeatherByCity").mockImplementation(() => {
      return Promise.resolve({
        ...weatherServiceMockedResponse,
        name: "Rotterdam",
      })
    })

    vi.spyOn(AirPollutionService, "getAirPollutionByCity").mockImplementation(
      () => {
        return Promise.resolve({
          ...fetchAirPolutionMockedResponse,
          name: "Rotterdam",
        })
      },
    )

    render(<Dashboard />, { wrapper })

    const searchInput = screen.getByTestId("input-search-by-city") // input data-testid=input-search-by-city
    const searchButton = screen.getByTestId("btn-search")

    fireEvent.change(searchInput, { target: { value: "Rotterdam" } })

    await act(async () => {
      await fireEvent.click(searchButton)
    })

    expect(ForecastService.getForecastByCity).toHaveBeenCalled()
    expect(WeatherService.getWeatherByCity).toHaveBeenCalled()

    const locationWeather = screen.getByTestId("city-name") // div
    expect(locationWeather.textContent).toEqual("Rotterdam")
  })
})
