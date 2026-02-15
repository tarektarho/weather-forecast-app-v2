import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import CurrentWidget from "./CurrentWidget"
import type { WeatherContextValue } from "../../../providers/weatherContext"
import type WeatherData from "../../../types/weather"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockCopyShareUrl = vi.fn()
const mockUseWeather = vi.fn()

vi.mock("../../../providers/weatherContext", () => ({
  useWeather: () => mockUseWeather(),
}))

vi.mock("../../common/skeletons/CurrentWidgetSkeleton", () => ({
  default: () => <div data-testid="current-widget-skeleton">Loading…</div>,
}))

// Stub image imports
vi.mock("../../../assets/images/share.png", () => ({ default: "share.png" }))
vi.mock("../../../assets/images/reset.png", () => ({ default: "reset.png" }))

// Mock resetApp so we can assert on it
const mockResetApp = vi.fn()
vi.mock("../../../utils", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    resetApp: (...args: unknown[]) => mockResetApp(...args),
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
      temp: 293.15, // 20 °C
      feels_like: 291.15, // 18 °C
      temp_min: 290.15, // 17 °C
      temp_max: 295.15, // 22 °C
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
      sunrise: 1700000000,
      sunset: 1700040000,
    },
    timezone: 3600,
    id: 12345,
    name: "Amsterdam",
    cod: 200,
    ...overrides,
  }
}

function mockContext(
  weatherOverrides: Partial<WeatherContextValue["weatherData"]> = {},
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
      ...weatherOverrides,
    },
    copyShareUrl: mockCopyShareUrl,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CurrentWidget", () => {
  // Skeleton / loading states -------------------------------------------------

  it("shows skeleton when weatherData.data is undefined", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: undefined }))
    render(<CurrentWidget />)
    expect(screen.getByTestId("current-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isLoading is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isLoading: true }),
    )
    render(<CurrentWidget />)
    expect(screen.getByTestId("current-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isFetching is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isFetching: true }),
    )
    render(<CurrentWidget />)
    expect(screen.getByTestId("current-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when data fails the type guard (no main/name/weather)", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: { foo: "bar" } as unknown as WeatherData }),
    )
    render(<CurrentWidget />)
    expect(screen.getByTestId("current-widget-skeleton")).toBeInTheDocument()
  })

  // Rendered content ----------------------------------------------------------

  it("renders city name", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)
    expect(screen.getByTestId("city-name")).toHaveTextContent("Amsterdam")
  })

  it("renders weather description", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)
    expect(screen.getByText("clear sky")).toBeInTheDocument()
  })

  it("renders main weather detail", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)
    expect(screen.getByText("Clear")).toBeInTheDocument()
  })

  it("renders converted temperatures in celsius", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)

    // temp = 293.15 K → 20 °C  (appears in main card + extra section)
    const tempTexts = screen.getAllByText("20º")
    expect(tempTexts.length).toBeGreaterThanOrEqual(1)

    // feels_like = 291.15 K → 18 °C
    expect(screen.getByText("18º")).toBeInTheDocument()
  })

  it("renders humidity and pressure", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)
    expect(screen.getByText("65%")).toBeInTheDocument()
    expect(screen.getByText("1013")).toBeInTheDocument()
  })

  it("renders temp max and temp min", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)
    // temp_max = 295.15 K → 22 °C
    expect(screen.getByText("22º")).toBeInTheDocument()
    // temp_min = 290.15 K → 17 °C
    expect(screen.getByText("17º")).toBeInTheDocument()
  })

  it("renders weather icon with correct alt text", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)
    const icon = screen.getByAltText("01d")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveAttribute(
      "src",
      "https://openweathermap.org/img/wn/01d@2x.png",
    )
  })

  // User actions --------------------------------------------------------------

  it("calls copyShareUrl when share icon is clicked", async () => {
    const user = userEvent.setup()
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)

    await user.click(screen.getByAltText("Share"))
    expect(mockCopyShareUrl).toHaveBeenCalledTimes(1)
  })

  it("renders share and reset icons", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeWeatherData(), isSuccess: true }),
    )
    render(<CurrentWidget />)
    expect(screen.getByAltText("Share")).toBeInTheDocument()
    expect(screen.getByAltText("Reset")).toBeInTheDocument()
  })
})
