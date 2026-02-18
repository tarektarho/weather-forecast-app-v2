import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Dashboard from "./Dashboard"
import type { WeatherContextValue } from "../../providers/weatherContext"
import * as StorageModule from "../../browser/storage"
import type WeatherData from "../../types/weather"
import notificationStyles from "../../components/Notification/styles.module.scss"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockHideModal = vi.fn()
const mockHideError = vi.fn()
const mockSetInfo = vi.fn()
const mockCopyShareUrl = vi.fn()
const mockSearchByCity = vi.fn()
const mockSetCity = vi.fn()
const mockUseWeather = vi.fn()

vi.mock("../../providers/weatherContext", () => ({
  useWeather: () => mockUseWeather(),
}))

// Mock child widgets to isolate Dashboard logic
vi.mock("../../components/widgets/CurrentWidget/CurrentWidget", () => ({
  default: () => <div data-testid="current-widget">CurrentWidget</div>,
}))
vi.mock("../../components/widgets/DailyWidget/DailyWidget", () => ({
  default: () => <div data-testid="daily-widget">DailyWidget</div>,
}))
vi.mock("../../components/widgets/AdditionalWidget/AdditionalWidget", () => ({
  default: () => <div data-testid="additional-widget">AdditionalWidget</div>,
}))
vi.mock(
  "../../components/widgets/AirPollutionWidget/AirPollutionWidget",
  () => ({
    default: () => (
      <div data-testid="air-pollution-widget">AirPollutionWidget</div>
    ),
  }),
)
vi.mock("../../components/Search/Search", () => ({
  default: () => <div data-testid="search">Search</div>,
}))

// Stub image imports
vi.mock("../../assets/images/error.png", () => ({ default: "error.png" }))
vi.mock("../../assets/images/close.png", () => ({ default: "close.png" }))
vi.mock("../../assets/images/map.jpeg", () => ({ default: "map.jpeg" }))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const emptyQuery = {
  data: undefined,
  error: undefined,
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  isUninitialized: true,
}

function defaultContext(
  overrides: Partial<WeatherContextValue> = {},
): WeatherContextValue {
  return {
    city: "",
    setCity: mockSetCity,
    searchByCity: mockSearchByCity,
    weatherData: { ...emptyQuery },
    forecastData: { ...emptyQuery },
    airPollutionData: { ...emptyQuery },
    copyShareUrl: mockCopyShareUrl,
    modal: true,
    hideModal: mockHideModal,
    error: undefined,
    hideError: mockHideError,
    info: undefined,
    setInfo: mockSetInfo,
    setError: vi.fn(),
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockUseWeather.mockReturnValue(defaultContext())
  })

  it("renders the main container", () => {
    render(<Dashboard />)
    expect(screen.getByTestId("main-container")).toBeInTheDocument()
  })

  it("renders child widgets", () => {
    render(<Dashboard />)
    expect(screen.getByTestId("current-widget")).toBeInTheDocument()
    expect(screen.getByTestId("daily-widget")).toBeInTheDocument()
    expect(screen.getByTestId("additional-widget")).toBeInTheDocument()
    expect(screen.getByTestId("air-pollution-widget")).toBeInTheDocument()
    expect(screen.getByTestId("search")).toBeInTheDocument()
  })

  it("renders the app title", () => {
    render(<Dashboard />)
    expect(screen.getByText("WeatherApp")).toBeInTheDocument()
  })

  it("renders location-specific title when weather data is available", () => {
    mockUseWeather.mockReturnValue(
      defaultContext({
        weatherData: {
          ...emptyQuery,
          data: {
            coord: { lon: 4.8952, lat: 52.3676 },
            base: "stations",
            main: {
              temp: 15,
              feels_like: 14,
              temp_min: 12,
              temp_max: 18,
              pressure: 1013,
              humidity: 65,
            },
            visibility: 10000,
            wind: { speed: 5, deg: 230, gust: 7 },
            clouds: { all: 20 },
            dt: 1234567890,
            sys: {
              type: 1,
              id: 1234,
              country: "NL",
              sunrise: 1234567000,
              sunset: 1234567900,
            },
            timezone: 3600,
            id: 2747373,
            name: "Amsterdam",
            cod: 200,
            weather: [
              { description: "clear sky", icon: "01d", id: 800, main: "Clear" },
            ],
          },
          isSuccess: true,
        },
      }),
    )
    render(<Dashboard />)
    // React 19 hoists <title> to document.title
    expect(document.title).toBe("Weather in Amsterdam - WeatherApp")
  })

  it("renders weather description in meta content when available", () => {
    mockUseWeather.mockReturnValue(
      defaultContext({
        weatherData: {
          ...emptyQuery,
          data: {
            coord: { lon: 13.3889, lat: 52.52 },
            base: "stations",
            main: {
              temp: 12,
              feels_like: 11,
              temp_min: 10,
              temp_max: 14,
              pressure: 1015,
              humidity: 70,
            },
            visibility: 10000,
            wind: { speed: 4, deg: 240, gust: 6 },
            clouds: { all: 60 },
            dt: 1234567890,
            sys: {
              type: 1,
              id: 5678,
              country: "DE",
              sunrise: 1234567000,
              sunset: 1234567900,
            },
            timezone: 3600,
            id: 2950159,
            name: "Berlin",
            cod: 200,
            weather: [
              {
                description: "scattered clouds",
                icon: "03d",
                id: 803,
                main: "Clouds",
              },
            ],
          },
          isSuccess: true,
        },
      }),
    )
    render(<Dashboard />)
    const meta = document.querySelector('meta[name="description"]')
    expect(meta?.getAttribute("content")).toContain("scattered clouds")
  })

  it("renders weatherData.error as 'An error occurred' for non-object errors", () => {
    mockUseWeather.mockReturnValue(
      defaultContext({
        weatherData: {
          ...emptyQuery,
          error: "something went wrong",
          isError: true,
        },
      }),
    )
    render(<Dashboard />)
    const notification = screen.getByTestId("notification")
    expect(notification.textContent).toContain("An error occurred")
  })
})

describe("Dashboard – Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it("shows welcome modal when modal=true and localStorage has no key", () => {
    vi.spyOn(StorageModule, "getLocalStorageItem").mockReturnValue(null)
    mockUseWeather.mockReturnValue(defaultContext({ modal: true }))
    render(<Dashboard />)
    expect(screen.getByTestId("modal-container")).toBeVisible()
  })

  it("hides modal after clicking continue", () => {
    vi.spyOn(StorageModule, "getLocalStorageItem").mockReturnValue(null)
    mockUseWeather.mockReturnValue(defaultContext({ modal: true }))
    render(<Dashboard />)

    fireEvent.click(screen.getByTestId("hide-modal-btn"))
    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  it("does not show modal when modal=false", () => {
    mockUseWeather.mockReturnValue(defaultContext({ modal: false }))
    render(<Dashboard />)
    expect(screen.queryByTestId("modal-container")).toBeNull()
  })

  it("does not show modal when localStorage already has welcomeModal", () => {
    vi.spyOn(StorageModule, "getLocalStorageItem").mockReturnValue(true)
    mockUseWeather.mockReturnValue(defaultContext({ modal: true }))
    render(<Dashboard />)
    expect(screen.queryByTestId("modal-container")).toBeNull()
  })
})

describe("Dashboard – Error notification", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it("renders error notification when error is set", () => {
    mockUseWeather.mockReturnValue(defaultContext({ error: "city not found" }))
    render(<Dashboard />)

    const notification = screen.getByTestId("notification")
    expect(notification).toBeVisible()
    expect(notification).toHaveClass(notificationStyles.error)
    expect(notification.textContent).toContain("city not found")
  })

  it("renders error notification from weatherData.error", () => {
    mockUseWeather.mockReturnValue(
      defaultContext({
        weatherData: {
          ...emptyQuery,
          error: { status: 404, data: "city not found" },
          isError: true,
        },
      }),
    )
    render(<Dashboard />)

    const notification = screen.getByTestId("notification")
    expect(notification).toBeVisible()
    expect(notification.textContent).toContain("city not found")
  })

  it("calls hideError when close icon is clicked", () => {
    mockUseWeather.mockReturnValue(defaultContext({ error: "some error" }))
    render(<Dashboard />)

    fireEvent.click(screen.getByTestId("close-icon"))
    expect(mockHideError).toHaveBeenCalledTimes(1)
  })

  it("does not render error notification when no error", () => {
    mockUseWeather.mockReturnValue(defaultContext())
    render(<Dashboard />)
    expect(screen.queryByTestId("notification")).toBeNull()
  })
})

describe("Dashboard – Info notification", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it("renders info notification when info is set", () => {
    mockUseWeather.mockReturnValue(
      defaultContext({ info: "URL was copied to clipboard" }),
    )
    render(<Dashboard />)

    const notification = screen.getByTestId("notification")
    expect(notification).toBeVisible()
    expect(notification).toHaveClass(notificationStyles.info)
    expect(notification.textContent).toContain("URL was copied to clipboard")
  })

  it("clears info via setInfo(undefined) when close icon is clicked", () => {
    mockUseWeather.mockReturnValue(
      defaultContext({ info: "URL was copied to clipboard" }),
    )
    render(<Dashboard />)

    fireEvent.click(screen.getByTestId("close-icon"))
    expect(mockSetInfo).toHaveBeenCalledWith(undefined)
  })
})

describe("Dashboard – default metadata (no weather data)", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it("renders default title when weatherData has no data", () => {
    mockUseWeather.mockReturnValue(defaultContext())
    render(<Dashboard />)
    expect(document.title).toBe("WeatherApp - Real-time Weather Forecast")
  })

  it("renders default meta description when weatherData has no data", () => {
    mockUseWeather.mockReturnValue(defaultContext())
    render(<Dashboard />)
    const meta = document.querySelector('meta[name="description"]')
    expect(meta?.getAttribute("content")).toBe(
      "Get real-time weather forecasts, air pollution data, and 5-day weather forecasts for any location.",
    )
  })

  it("renders default metadata with empty weatherData object", () => {
    mockUseWeather.mockReturnValue(
      defaultContext({
        weatherData: {
          ...emptyQuery,
          data: null as unknown as WeatherData,
          isSuccess: true,
        },
      }),
    )
    render(<Dashboard />)
    expect(document.title).toBe("WeatherApp - Real-time Weather Forecast")
  })
})
