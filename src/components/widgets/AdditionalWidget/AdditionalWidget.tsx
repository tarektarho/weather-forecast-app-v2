import type { FC } from "react"
import { useWeather } from "../../../providers/weatherContext"
import Sunrise from "../../../assets/images/day-image.png"
import Sunset from "../../../assets/images/night-image.png"
import { getHour } from "../../../utils/date"
import AdditionalWidgetSkeleton from "../../common/skeletons/AdditionalWidgetSkeleton"
import type WeatherData from "../../../types/weather"
import shared from "../../../styles/shared.module.scss"
import styles from "./styles.module.scss"

/**
 * Displays additional weather data such as sunrise and sunset times.
 *
 * Consumes weather data from {@link useWeather} context and renders the
 * sunrise/sunset times adjusted to the queried city's timezone.
 * Shows a skeleton loader while data is loading or unavailable.
 *
 * @component
 */
const AdditionalWidget: FC = () => {
  const { weatherData } = useWeather()

  // Check if weather data is not available
  if (!weatherData || !weatherData.data) {
    return <AdditionalWidgetSkeleton />
  }

  // Type guard to check if data is WeatherData
  const isWeatherData = (data: unknown): data is WeatherData => {
    return (
      typeof data === "object" &&
      data !== null &&
      "sys" in data &&
      typeof (data as WeatherData).sys === "object"
    )
  }

  // Check if weather data is loading or not available
  if (
    weatherData.isLoading ||
    weatherData.isFetching ||
    !isWeatherData(weatherData.data)
  ) {
    return <AdditionalWidgetSkeleton />
  }

  // Extract sunrise and sunset times from weather data
  const { sunrise, sunset } = weatherData.data.sys
  const { timezone } = weatherData.data

  return (
    <div className={`${shared.weatherExtraWrapper} ${styles.myOtherStep}`}>
      {/* Widget title */}
      <h2 className={shared.widgetTitle}>More data from OpenWeather</h2>
      <div className={shared.extraInfoContainer}>
        {/* Sunrise information */}
        <div
          className={`${shared.widget} ${shared.weatherExtra} ${shared.bgExtra1}`}
        >
          <img
            className={shared.weatherExtraImg}
            src={Sunrise}
            alt="sunrise"
            width={42}
            height={42}
            loading="lazy"
          />
          {/* Display the sunrise time */}
          <h4 data-testid="sunrise">{getHour(sunrise, timezone)}</h4>
        </div>
        {/* Sunset information */}
        <div
          className={`${shared.widget} ${shared.weatherExtra} ${shared.bgExtra4} ${shared.mb0}`}
        >
          <img
            className={shared.weatherExtraImg}
            src={Sunset}
            alt="sunset"
            width={42}
            height={42}
            loading="lazy"
          />
          {/* Display the sunset time */}
          <h4 data-testid="sunset">{getHour(sunset, timezone)}</h4>
        </div>
      </div>
    </div>
  )
}

export default AdditionalWidget
