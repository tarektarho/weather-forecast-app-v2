import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import AirPollutionWidget from "../AirPollutionWidget"
import type { WeatherContextValue } from "../../../providers/weatherContext"
import type AirPollutionData from "../../../types/airPollution"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockUseWeather = vi.fn()

vi.mock("../../../providers/weatherContext", () => ({
  useWeather: () => mockUseWeather(),
}))

vi.mock("../../common/skeletons/AirPollutionWidgetSkeleton", () => ({
  default: () => <div data-testid="air-pollution-skeleton">Loading…</div>,
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeAirPollutionData(
  aqi: number = 1,
  componentOverrides: Partial<AirPollutionData["list"][0]["components"]> = {},
): AirPollutionData {
  return {
    coord: { lat: 52.37, lon: 4.89 },
    list: [
      {
        dt: 1700000000,
        main: { aqi },
        components: {
          co: 201.94,
          nh3: 0.72,
          no: 0.01,
          no2: 0.77,
          o3: 68.66,
          pm2_5: 0.5,
          pm10: 1.23,
          so2: 0.64,
          ...componentOverrides,
        },
      },
    ],
  }
}

function mockContext(
  overrides: Partial<WeatherContextValue["airPollutionData"]> = {},
): Partial<WeatherContextValue> {
  return {
    airPollutionData: {
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

describe("AirPollutionWidget", () => {
  // Skeleton / loading states -----------------------------------------------

  it("shows skeleton when airPollutionData.data is undefined", () => {
    mockUseWeather.mockReturnValue(mockContext({ data: undefined }))
    render(<AirPollutionWidget />)
    expect(screen.getByTestId("air-pollution-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when airPollutionData is null/falsy", () => {
    mockUseWeather.mockReturnValue({ airPollutionData: null })
    render(<AirPollutionWidget />)
    expect(screen.getByTestId("air-pollution-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isLoading is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(), isLoading: true }),
    )
    render(<AirPollutionWidget />)
    expect(screen.getByTestId("air-pollution-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when isFetching is true", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(), isFetching: true }),
    )
    render(<AirPollutionWidget />)
    expect(screen.getByTestId("air-pollution-skeleton")).toBeInTheDocument()
  })

  it("shows skeleton when data fails the type guard (no list)", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: { foo: "bar" } as unknown as AirPollutionData }),
    )
    render(<AirPollutionWidget />)
    expect(screen.getByTestId("air-pollution-skeleton")).toBeInTheDocument()
  })

  // Rendered content --------------------------------------------------------

  it("renders the title", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(), isSuccess: true }),
    )
    render(<AirPollutionWidget />)
    expect(screen.getByTestId("airpollution-widget-title")).toHaveTextContent(
      "Your Current Air Pollution",
    )
  })

  it.each([
    [1, "Good Quality"],
    [2, "Fair Quality"],
    [3, "Moderate Quality"],
    [4, "Poor Quality"],
    [5, "Very Poor Quality"],
  ])("displays '%s' quality as '%s'", (aqi, label) => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(aqi), isSuccess: true }),
    )
    render(<AirPollutionWidget />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("renders empty quality text for unknown AQI value", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(0), isSuccess: true }),
    )
    render(<AirPollutionWidget />)
    // AQI 0 is not in the quality map, so the h3 should be empty
    expect(screen.getByTestId("airpollution-widget-title")).toBeInTheDocument()
  })

  it("renders all 8 pollution component cards", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(), isSuccess: true }),
    )
    render(<AirPollutionWidget />)

    const expectedLabels = [
      "CO",
      "Nh3",
      "NO",
      "No2",
      "O3",
      "Pm2 5",
      "Pm 10",
      "So2",
    ]
    for (const label of expectedLabels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it("renders correct component values", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(), isSuccess: true }),
    )
    render(<AirPollutionWidget />)

    const values = screen.getAllByTestId("airpollution-co")
    expect(values).toHaveLength(8)

    // Verify the values match the mock data
    const expectedValues = [201.94, 0.72, 0.01, 0.77, 68.66, 0.5, 1.23, 0.64]
    values.forEach((el, i) => {
      expect(el).toHaveTextContent(String(expectedValues[i]))
    })
  })

  it("renders sequential numbering (1–8) for each component", () => {
    mockUseWeather.mockReturnValue(
      mockContext({ data: makeAirPollutionData(), isSuccess: true }),
    )
    render(<AirPollutionWidget />)

    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })
})
