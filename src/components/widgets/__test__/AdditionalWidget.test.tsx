import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import AdditionalWidget from "../AdditionalWidget"
import type { WeatherContextValue } from "../../../providers/weatherContext"
import type WeatherData from "../../../types/weather"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockUseWeather = vi.fn()

vi.mock("../../../providers/weatherContext", () => ({
  useWeather: () => mockUseWeather(),
}))

vi.mock("../../common/skeletons/AdditionalWidgetSkeleton", () => ({
  default: () => <div data-testid="additional-widget-skeleton">Loading…</div>,
}))

vi.mock("../../../assets/images/day-image.png", () => ({
  default: "sunrise.png",
}))
vi.mock("../../../assets/images/night-image.png", () => ({
  default: "sunset.png",
}))

// Mock getHour to return a predictable value based on the timestamp
vi.mock("../../../utils/index", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    getHour: (ts: number) => (ts === 1700006400 ? "07:00:00" : "16:30:00"),
  }
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeWeatherData(overrides: Partial<WeatherData> = {}): WeatherData {
  return {
    coord: { lat: 52.37, lon: 4.89 },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    ],
    base: "stations",
    main: {
      temp: 293.15,
      feels_like: 291.15,
      temp_min: 290.15,
      temp_max: 295.15,
      pressure: 1013,
      humidity: 65,
    },
    visibility: 10000,
    wind: { speed: 5, deg: 180, gust: 8 },
    clouds: { all: 0 },
    dt: 1700000000,
    sys: {
      type: 1,
      id: 1,
      country: "NL",
      sunrise: 1700006400,
      sunset: 1700040600,
    },
    timezone: 3600,
    id: 12345,
    name: "Amsterdam",
    cod: 200,
    ...overrides,
  }
}

function mockContext(
  overrides: Partial<WeatherContextValue["weatherData"]> = {},
): Partial<WeatherContextValue> {
  return {
    weatherData: {
      data: undefined,
      error: undefined,
      isLoading: false,
      isFetching: false,
      isSuccess: false,
      isError: false,
      isUninitialized: true,
      ...overrides,
    },
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AdditionalWidget", () => {
  // Skeleton / loading states -----------------------------------------------

  it("shows skeleton when weatherData.data is undefined", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: undefined }))
    render(<AdditionalWidget />)
    expect(screen.getByTestId("additional-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isLoading is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isLoading: true }),
    )
    render(<AdditionalWidget />)
    expect(screen.getByTestId("additional-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isFetching is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isFetching: true }),
    )
    render(<AdditionalWidget />)
    expect(screen.getByTestId("additional-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when data fails the type guard (no sys)", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: { name: "X" } as unknown as WeatherData }),
    )
    render(<AdditionalWidget />)
    expect(screen.getByTestId("additional-widget-skeleton")).toBeInTheDocument()
  })

  // Rendered content --------------------------------------------------------

  it("renders the widget title", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<AdditionalWidget />)
    expect(screen.getByText("More data from OpenWeather")).toBeInTheDocument()
  })

  it("renders sunrise time", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<AdditionalWidget />)
    expect(screen.getByTestId("sunrise")).toHaveTextContent("07:00:00")
  })

  it("renders sunset time", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<AdditionalWidget />)
    expect(screen.getByTestId("sunset")).toHaveTextContent("16:30:00")
  })

  it("renders sunrise and sunset images with correct alt text", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<AdditionalWidget />)
    expect(screen.getByAltText("sunrise")).toBeInTheDocument()
    expect(screen.getByAltText("sunset")).toBeInTheDocument()
  })
})
