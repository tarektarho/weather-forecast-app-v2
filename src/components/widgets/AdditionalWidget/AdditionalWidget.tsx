import type { FC } from "react"
import { useWeather } from "../../../providers/weatherContext"
import Sunrise from "../../../assets/images/day-image.png"
import Sunset from "../../../assets/images/night-image.png"
import { getHour } from "../../../utils/date"
import AdditionalWidgetSkeleton from "../../common/skeletons/AdditionalWidgetSkeleton"
import type WeatherData from "../../../types/weather"
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
    <div className={`weather-extra-wrapper ${styles.myOtherStep}`}>
      {/* Widget title */}
      <h4 className="widget-title">More data from OpenWeather</h4>
      <div className="extra-info-container">
        {/* Sunrise information */}
        <div className="widget weather-extra bg-extra1">
          <img
            className="weather-extra-img"
            src={Sunrise}
            alt="sunrise"
            loading="lazy"
          />
          {/* Display the sunrise time */}
          <h4 data-testid="sunrise">{getHour(sunrise, timezone)}</h4>
        </div>
        {/* Sunset information */}
        <div className="widget weather-extra bg-extra4 mb-0">
          <img
            className="weather-extra-img"
            src={Sunset}
            alt="sunset"
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
