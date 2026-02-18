import type { FC, JSX } from "react"
import { useWeather } from "../../../providers/weatherContext"
import DailyDetail from "../DailyDetail/DailyDetail"
import type { ForecastItem } from "../../../types/forecast"
import type ForecastData from "../../../types/forecast"
import DailyWidgetSkeleton from "../../common/skeletons/DailyWidgetSkeleton"
import shared from "../../../styles/shared.module.scss"
import styles from "./styles.module.scss"

/**
 * DailyWidget component that displays a 5-day weather forecast.
 *
 * Retrieves forecast and weather data from the weather context and renders
 * a list of daily forecast items. Shows a skeleton loader while data is being
 * fetched or if the data is invalid.
 *
 * @component
 * @returns {JSX.Element} A widget displaying the next 5 days of forecast data,
 *                        or a skeleton loader if data is unavailable or loading.
 *
 * @example
 * // Usage within a dashboard or main weather app
 * <DailyWidget />
 *
 * @remarks
 * - Requires the `useWeather` hook to be available in the context
 * - Uses type guard to validate ForecastData structure
 * - Displays skeleton loader during loading, fetching, or invalid data states
 *
 * @see {@link DailyDetail} for individual forecast item rendering
 * @see {@link DailyWidgetSkeleton} for the loading state UI
 */
const DailyWidget: FC = (): JSX.Element => {
  // Retrieve forecast and weather data from the weather context
  const { forecastData, weatherData } = useWeather()

  if (!forecastData || !forecastData.data) {
    return <DailyWidgetSkeleton />
  }

  // Type guard to check if data is ForecastData
  const isForecastData = (data: unknown): data is ForecastData => {
    return (
      typeof data === "object" &&
      data !== null &&
      "list" in data &&
      Array.isArray((data as ForecastData).list)
    )
  }

  if (
    forecastData.isLoading ||
    forecastData.isFetching ||
    !isForecastData(forecastData.data) ||
    Object.keys(forecastData.data).length === 0
  ) {
    return <DailyWidgetSkeleton />
  }

  const { list: forecastList } = forecastData.data
  const timezoneOffset = weatherData?.data?.timezone

  // Render the forecast data if available
  return (
    <>
      <h2 className={shared.widgetTitle} data-testid="daily-widget-title">
        Forecast next 5 days
      </h2>
      <div className={styles.dailyContainer}>
        <div className={styles.dailyWrapper}>
          {forecastList &&
            forecastList.map((item: ForecastItem) => (
              <DailyDetail
                key={item.dt}
                data={item}
                timezoneOffset={timezoneOffset}
              />
            ))}
        </div>
      </div>
    </>
  )
}

export default DailyWidget
