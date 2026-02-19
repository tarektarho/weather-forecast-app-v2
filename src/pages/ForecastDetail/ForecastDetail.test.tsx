import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, it, expect, vi } from "vitest"
import ForecastDetail from "./ForecastDetail"
import type { WeatherContextValue } from "../../providers/weatherContext"
import type ForecastData from "../../types/forecast"
import type { ForecastItem } from "../../types/forecast"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockUseWeather = vi.fn()
vi.mock("../../providers/weatherContext", () => ({
  useWeather: () => mockUseWeather(),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeForecastItem(overrides: Partial<ForecastItem> = {}): ForecastItem {
  return {
    dt: 1700000000,
    main: {
      temp: 295,
      feels_like: 293,
      temp_min: 291,
      temp_max: 297,
      pressure: 1013,
      sea_level: 1013,
      grnd_level: 1009,
      humidity: 65,
      temp_kf: 0,
    },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    ],
    clouds: { all: 10 },
    wind: { speed: 3.5, deg: 200, gust: 5.2 },
    visibility: 10000,
    pop: 0.2,
    sys: { pod: "d" },
    dt_txt: "2025-11-14 12:00:00",
    ...overrides,
  }
}

function makeForecastData(
  list: ForecastItem[] = [makeForecastItem()],
): ForecastData {
  return { cod: "200", message: 0, cnt: list.length, list }
}

function mockContext(
  forecastOverrides: Partial<WeatherContextValue["forecastData"]> = {},
  weatherOverrides: Partial<WeatherContextValue["weatherData"]> = {},
): Partial<WeatherContextValue> {
  return {
    forecastData: {
      data: undefined,
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: false,
      isUninitialized: true,
      ...forecastOverrides,
    },
    weatherData: {
      data: undefined,
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: false,
      isUninitialized: true,
      ...weatherOverrides,
    },
  }
}

function renderWithRoute(dt: string) {
  return render(
    <MemoryRouter initialEntries={[`/forecast/${dt}`]}>
      <Routes>
        <Route path="/forecast/:dt" element={<ForecastDetail />} />
        <Route
          path="/"
          element={<div data-testid="dashboard">Dashboard</div>}
        />
      </Routes>
    </MemoryRouter>,
  )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ForecastDetail", () => {
  it("renders the not-found message when no matching forecast item exists", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: makeForecastData() }))
    renderWithRoute("9999999999")

    expect(screen.getByTestId("forecast-detail-empty")).toBeInTheDocument()
    expect(screen.getByText(/Forecast data not available/)).toBeVisible()
  })

  it("renders the back link", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: makeForecastData() }))
    renderWithRoute("1700000000")

    const backLink = screen.getByTestId("back-link")
    expect(backLink).toBeVisible()
    expect(backLink).toHaveAttribute("href", "/")
  })

  it("renders forecast detail when matching item is found", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: makeForecastData() }))
    renderWithRoute("1700000000")

    expect(screen.getByTestId("forecast-detail")).toBeInTheDocument()
    expect(screen.getByTestId("forecast-description")).toHaveTextContent(
      "clear sky",
    )
  })

  it("shows the data grid with temperature, wind, atmosphere, and conditions", () => {
    const item = makeForecastItem({
      main: {
        temp: 295,
        feels_like: 293,
        temp_min: 291,
        temp_max: 297,
        pressure: 1013,
        sea_level: 1013,
        grnd_level: 1009,
        humidity: 65,
        temp_kf: 0,
      },
      wind: { speed: 3.5, deg: 200, gust: 5.2 },
      clouds: { all: 10 },
      visibility: 10000,
      pop: 0.2,
    })

    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    const grid = screen.getByTestId("forecast-grid")
    expect(grid).toBeInTheDocument()

    // Temperature card
    expect(screen.getByText("Temperature")).toBeInTheDocument()
    expect(screen.getByText("21ºC")).toBeInTheDocument()

    // Wind card
    expect(screen.getByText("Wind")).toBeInTheDocument()
    expect(screen.getByText("3.5 m/s")).toBeInTheDocument()

    // Atmosphere card
    expect(screen.getByText("Atmosphere")).toBeInTheDocument()
    expect(screen.getByText("65%")).toBeInTheDocument()

    // Conditions card
    expect(screen.getByText("Conditions")).toBeInTheDocument()
    expect(screen.getByText("10%")).toBeInTheDocument()
  })

  it("renders not-found when forecastData is undefined", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: undefined }))
    renderWithRoute("1700000000")

    expect(screen.getByTestId("forecast-detail-empty")).toBeInTheDocument()
  })

  it("displays 'Night 🌙' when sys.pod is 'n'", () => {
    const item = makeForecastItem({
      sys: { pod: "n" },
    })
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    expect(screen.getByText(/Night 🌙/)).toBeInTheDocument()
  })

  it("displays 'Day ☀️' when sys.pod is 'd'", () => {
    const item = makeForecastItem({
      sys: { pod: "d" },
    })
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    expect(screen.getByText(/Day ☀️/)).toBeInTheDocument()
  })

  it("renders visibility in km", () => {
    const item = makeForecastItem({ visibility: 5000 })
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    expect(screen.getByText("5.0 km")).toBeInTheDocument()
  })

  it("renders rain probability as percentage", () => {
    const item = makeForecastItem({ pop: 0.75 })
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    expect(screen.getByText("75%")).toBeInTheDocument()
  })

  it("renders the weather icon with correct alt text", () => {
    const item = makeForecastItem()
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    const img = screen.getByAltText("Weather icon for clear sky")
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("width", "100")
  })

  it("renders atmosphere details (pressure, sea level, ground level)", () => {
    const item = makeForecastItem({
      main: {
        temp: 295,
        feels_like: 293,
        temp_min: 291,
        temp_max: 297,
        pressure: 1015,
        sea_level: 1020,
        grnd_level: 1009,
        humidity: 65,
        temp_kf: 0,
      },
    })
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    expect(screen.getByText("1015 hPa", { exact: false })).toBeInTheDocument()
    expect(screen.getByText("1020 hPa", { exact: false })).toBeInTheDocument()
    expect(screen.getByText("1009 hPa", { exact: false })).toBeInTheDocument()
  })

  it("renders wind gust and direction", () => {
    const item = makeForecastItem()
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData([item]) }),
    )
    renderWithRoute(String(item.dt))

    expect(screen.getByText("200°")).toBeInTheDocument()
    expect(screen.getByText("5.2 m/s")).toBeInTheDocument()
  })
})
