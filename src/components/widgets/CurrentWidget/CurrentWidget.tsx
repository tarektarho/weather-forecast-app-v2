import type { FC } from "react"
import { useWeather } from "../../../providers/weatherContext"
import { getWeatherIcon } from "../../../utils/date"
import { resetApp } from "../../../features/api/services/shareLink"
import { convertKelvinToCelsius } from "../../../utils/temperature"
import shareIcon from "../../../assets/images/share.png"
import resetIcon from "../../../assets/images/reset.png"
import CurrentWidgetSkeleton from "../../common/skeletons/CurrentWidgetSkeleton"
import type WeatherData from "../../../types/weather"
import shared from "../../../styles/shared.module.scss"
import styles from "./styles.module.scss"

/**
 * Displays the current weather conditions for the selected location.
 *
 * Shows temperature, weather description, humidity, pressure, and
 * min/max temperatures. Provides share and reset actions.
 * Renders a skeleton loader while data is loading or unavailable.
 *
 * @component
 */
const CurrentWidget: FC = () => {
  // Get weatherData and copyShareUrl from the weather context
  const { weatherData, copyShareUrl } = useWeather()

  // If weatherData is not available or doesn't contain data, return.
  if (!weatherData || !weatherData.data) {
    return <CurrentWidgetSkeleton />
  }

  // Type guard to check if data is WeatherData
  const isWeatherData = (data: unknown): data is WeatherData => {
    return (
      typeof data === "object" &&
      data !== null &&
      "main" in data &&
      "name" in data &&
      "weather" in data
    )
  }

  // If weatherData is loading or data is not valid, return.
  if (
    weatherData.isLoading ||
    weatherData.isFetching ||
    !isWeatherData(weatherData.data)
  ) {
    return <CurrentWidgetSkeleton />
  }

  // Destructure necessary information from weatherData
  const fullWeatherInfo = weatherData.data
  const { main, name: location, weather } = fullWeatherInfo
  const { temp, feels_like, humidity, pressure, temp_max, temp_min } = main
  const { main: mainDetail, icon, description } = weather[0]

  // Return the CurrentWidget component with weather information
  return (
    <>
      <div className={`${shared.widget} ${styles.weatherDetail}`}>
        <div className={styles.widgetActions}>
          <div className={styles.iconsContainer} title="Reset" hidden>
            <img
              onClick={resetApp}
              className={styles.currentWidgetIcon}
              src={resetIcon}
              alt="Reset"
              width={24}
              height={24}
            />
          </div>
          <div className={styles.iconsContainer} title="Share">
            <img
              onClick={copyShareUrl}
              className={styles.currentWidgetIcon}
              src={shareIcon}
              alt="Share"
              width={24}
              height={24}
            />
          </div>
        </div>
        <h2 data-testid="city-name">{location}</h2>
        <img
          className={styles.icon}
          src={getWeatherIcon(icon)}
          alt={icon}
          width={100}
          height={100}
          loading="lazy"
        />
        <p className={styles.weatherText}>{description}</p>
        <h3 className={styles.weatherTemp}>{convertKelvinToCelsius(temp)}º</h3>
        <p className={styles.weatherText}>{mainDetail}</p>
      </div>
      <div className={shared.weatherExtraWrapper}>
        <div
          className={`${shared.widget} ${shared.weatherExtra} ${shared.bgExtra1}`}
        >
          <p>
            <span className={shared.weatherExtraLabel}>Temp</span> |{" "}
            <span className={shared.weatherExtraLabel}>
              {convertKelvinToCelsius(temp)}º
            </span>
          </p>
          <p>
            <span className={shared.weatherExtraLabel}>Feels like</span> |{" "}
            <span className={shared.weatherExtraLabel}>
              {convertKelvinToCelsius(feels_like)}º
            </span>
          </p>
        </div>
        <div
          className={`${shared.widget} ${shared.weatherExtra} ${shared.bgExtra2}`}
        >
          <p>
            <span className={shared.weatherExtraLabel}>Humidity</span> |{" "}
            <span className={shared.weatherExtraLabel}>{humidity}%</span>
          </p>
          <p>
            <span className={shared.weatherExtraLabel}>Pressure</span> |{" "}
            <span className={shared.weatherExtraLabel}>{pressure}</span>
          </p>
        </div>
        <div
          className={`${shared.widget} ${shared.weatherExtra} ${shared.bgExtra3} ${shared.mb0}`}
        >
          <p>
            <span className={shared.weatherExtraLabel}>Temp max</span> |{" "}
            <span className={shared.weatherExtraLabel}>
              {convertKelvinToCelsius(temp_max)}º
            </span>
          </p>
          <p>
            <span className={shared.weatherExtraLabel}>Temp min</span> |{" "}
            <span className={shared.weatherExtraLabel}>
              {convertKelvinToCelsius(temp_min)}º
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default CurrentWidget
