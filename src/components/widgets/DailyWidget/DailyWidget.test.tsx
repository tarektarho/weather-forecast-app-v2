import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import DailyWidget from "./DailyWidget"
import type { WeatherContextValue } from "../../../providers/weatherContext"
import type ForecastData from "../../../types/forecast"
import type { ForecastItem } from "../../../types/forecast"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock useWeather – we control the return value per test via mockReturnValue
const mockUseWeather = vi.fn()
vi.mock("../../../providers/weatherContext", () => ({
  useWeather: () => mockUseWeather(),
}))

// Mock DailyDetail to keep tests focused on DailyWidget logic
vi.mock("../DailyDetail/DailyDetail", () => ({
  default: ({ data }: { data: ForecastItem }) => (
    <div data-testid="daily-detail">{data.dt_txt}</div>
  ),
}))

// Mock skeleton
vi.mock("../../common/skeletons/DailyWidgetSkeleton", () => ({
  default: () => <div data-testid="daily-widget-skeleton">Loading…</div>,
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeForecastItem(overrides: Partial<ForecastItem> = {}): ForecastItem {
  return {
    dt: 1700000000,
    main: {
      temp: 280,
      feels_like: 278,
      temp_min: 277,
      temp_max: 282,
      pressure: 1013,
      sea_level: 1013,
      grnd_level: 1009,
      humidity: 80,
      temp_kf: 0,
    },
    weather: [
      { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    ],
    clouds: { all: 10 },
    wind: { speed: 3.5, deg: 200, gust: 5.2 },
    visibility: 10000,
    pop: 0,
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

/** Build a minimal context value with only forecastData filled. */
function mockContext(
  forecastOverrides: Partial<WeatherContextValue["forecastData"]> = {},
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
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DailyWidget", () => {
  it("shows skeleton when forecastData is undefined", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: undefined }))
    render(<DailyWidget />)
    expect(screen.getByTestId("daily-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when forecastData.data is null/undefined", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: undefined }))
    render(<DailyWidget />)
    expect(screen.getByTestId("daily-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isLoading is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData(), isLoading: true }),
    )
    render(<DailyWidget />)
    expect(screen.getByTestId("daily-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isFetching is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeForecastData(), isFetching: true }),
    )
    render(<DailyWidget />)
    expect(screen.getByTestId("daily-widget-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when data is an empty object (no list)", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: {} as ForecastData }))
    render(<DailyWidget />)
    expect(screen.getByTestId("daily-widget-skeleton")).toBeInTheDocument()
  })

  it("renders title when valid forecast data is available", () => {
    mockUseWeather.mockReturnValue(
      mockContext({
        data: makeForecastData(),
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      }),
    )
    render(<DailyWidget />)
    expect(screen.getByTestId("daily-widget-title")).toHaveTextContent(
      "Forecast next 5 days",
    )
  })

  it("renders a DailyDetail for each forecast item", () => {
    const items = [
      makeForecastItem({ dt: 1, dt_txt: "2025-11-14 12:00:00" }),
      makeForecastItem({ dt: 2, dt_txt: "2025-11-14 15:00:00" }),
      makeForecastItem({ dt: 3, dt_txt: "2025-11-14 18:00:00" }),
    ]

    mockUseWeather.mockReturnValue(
      mockContext({
        data: makeForecastData(items),
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      }),
    )

    render(<DailyWidget />)

    const details = screen.getAllByTestId("daily-detail")
    expect(details).toHaveLength(3)
    expect(details[0]).toHaveTextContent("2025-11-14 12:00:00")
    expect(details[1]).toHaveTextContent("2025-11-14 15:00:00")
    expect(details[2]).toHaveTextContent("2025-11-14 18:00:00")
  })

  it("renders no DailyDetail items when list is empty", () => {
    mockUseWeather.mockReturnValue(
      mockContext({
        data: makeForecastData([]),
        isLoading: false,
        isFetching: false,
        isSuccess: true,
      }),
    )

    render(<DailyWidget />)

    // Title should still be present but no detail cards
    expect(screen.getByTestId("daily-widget-title")).toBeInTheDocument()
    expect(screen.queryAllByTestId("daily-detail")).toHaveLength(0)
  })
})
