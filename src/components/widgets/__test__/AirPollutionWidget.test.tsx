import { render, screen } from "@testing-library/react"
import { fetchAirPolutionMockedResponse } from "../../../services/__test__/airPollution.test"
import type { WeatherContextValue } from "../../../providers/weatherContext"
import { WeatherContext } from "../../../providers/weatherContext"
import AirPollutionWidget from "../AirPollutionWidget"
import type { SetStateAction } from "react"

interface WeatherContextMockedValue extends WeatherContextValue {}
const WeatherContextMockedData = {
  airPollutionData: {
    loading: true,
    data: {},
  },
  weatherData: {
    loading: true,
    data: {},
  },
  forecastData: {
    loading: true,
    data: {},
  },
  city: "",
  setCity: (_value: SetStateAction<string>): void => {},
  searchByCity: (): void => {},
  copyShareUrl: (): void => {},
  modal: false,
  hideModal: (): void => {},
  error: undefined,
  hideError: (): void => {},
  info: undefined,
  setInfo: (_value: SetStateAction<string | undefined>): void => {},
  setError: (_value: SetStateAction<string | undefined>): void => {},
}

describe("AirPollutionWidget", () => {
  const contextValueMocked: WeatherContextMockedValue = WeatherContextMockedData

  const renderComponent = (
    contextValue = contextValueMocked,
    propsValues = {},
  ) => {
    render(
      <WeatherContext.Provider value={contextValue}>
        <AirPollutionWidget {...propsValues} />
      </WeatherContext.Provider>,
    )
  }

  it("renders skeleton when airPollutionData.data is null", () => {
    renderComponent({
      ...WeatherContextMockedData,
      airPollutionData: {
        loading: false,
        data: null as unknown as Record<string, never>,
      },
    })
    const skeletonComponent = screen.getAllByTestId("skeleton-test-id")[0]
    expect(skeletonComponent).toBeVisible()
  })

  it("renders is loading if airPollutionData.loading is true", () => {
    renderComponent()
    const skeletonComponent = screen.getAllByTestId("skeleton-test-id")[0]
    expect(skeletonComponent).toBeVisible()
  })
  it("renders is loading if airPollutionData.data is empty", () => {
    renderComponent({
      ...WeatherContextMockedData,
      airPollutionData: {
        loading: false,
        data: {},
      },
    })
    const skeletonComponent = screen.getAllByTestId("skeleton-test-id")[0]
    expect(skeletonComponent).toBeVisible()
  })

  it("renders if items present", () => {
    renderComponent({
      ...WeatherContextMockedData,
      airPollutionData: {
        loading: false,
        data: fetchAirPolutionMockedResponse,
      },
    })
    const title = screen.getByTestId("airpollution-widget-title")
    const co = screen.getAllByTestId("airpollution-co")

    expect(title).toBeVisible()
    expect(title).toHaveTextContent("Your Current Air Pollution")
    expect(co[0]).toHaveTextContent("247")
  })
})
