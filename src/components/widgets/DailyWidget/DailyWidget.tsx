import type { FC } from "react"
import { useWeather } from "../../../providers/weatherContext"
import DailyDetail from "../DailyDetail/DailyDetail"
import type { ForecastItem } from "../../../types/forecast"
import type ForecastData from "../../../types/forecast"
import DailyWidgetSkeleton from "../../common/skeletons/DailyWidgetSkeleton"
import styles from "./styles.module.scss"

const DailyWidget: FC = () => {
  // Retrieve forecast data from the weather context
  const { forecastData } = useWeather()

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

  // Render the forecast data if available
  return (
    <>
      <h3 className="widget-title" data-testid="daily-widget-title">
        Forecast next 5 days
      </h3>
      <div className={styles.dailyContainer}>
        <div className={styles.dailyWrapper}>
          {forecastList &&
            forecastList.map((item: ForecastItem) => (
              <DailyDetail key={item.dt} data={item} />
            ))}
        </div>
      </div>
    </>
  )
}

export default DailyWidget
