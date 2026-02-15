import { render, screen } from "@testing-library/react"
import { weatherServiceMockedResponse } from "../../../services/__test__/weather.test"
import type { WeatherContextValue } from "../../../providers/weatherContext"
import { WeatherContext } from "../../../providers/weatherContext"
import { getHour } from "../../../utils/index"
import AdditionalWidget from "../AdditionalWidget"
import type { SetStateAction } from "react"

interface WeatherContextMockedValue extends WeatherContextValue {}
const WeatherContextMockedData = {
  weatherData: {
    loading: true,
    data: {},
  },
  forecastData: {
    loading: true,
    data: {},
  },
  airPollutionData: {
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

describe("AdditionalWidget", () => {
  const contextValueMocked: WeatherContextMockedValue = WeatherContextMockedData
  const renderComponent = (
    contextValue = contextValueMocked,
    propsValues: Record<string, unknown> = {},
  ) => {
    render(
      <WeatherContext.Provider value={contextValue}>
        <AdditionalWidget {...propsValues} />
      </WeatherContext.Provider>,
    )
  }

  it("renders skeleton when weatherData.data is null", () => {
    renderComponent({
      ...WeatherContextMockedData,
      weatherData: {
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
      weatherData: {
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
      weatherData: {
        loading: false,
        data: weatherServiceMockedResponse,
      },
    })
    const sunrise = screen.getByTestId("sunrise")
    const sunset = screen.getByTestId("sunset")

    expect(sunrise).toBeVisible()
    expect(sunrise).toHaveTextContent(getHour(1691640861))

    expect(sunset).toBeVisible()
    expect(sunset).toHaveTextContent(getHour(1691694876))
  })
})
