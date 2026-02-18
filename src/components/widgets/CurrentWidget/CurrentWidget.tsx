import type { FC } from "react"
import { useWeather } from "../../../providers/weatherContext"
import { getWeatherIcon } from "../../../utils/date"
import { resetApp } from "../../../features/api/services/shareLink"
import { convertKelvinToCelsius } from "../../../utils/temperature"
import shareIcon from "../../../assets/images/share.png"
import resetIcon from "../../../assets/images/reset.png"
import CurrentWidgetSkeleton from "../../common/skeletons/CurrentWidgetSkeleton"
import type WeatherData from "../../../types/weather"
import styles from "./styles.module.scss"

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
      <div className={`widget ${styles.weatherDetail}`}>
        <div className={styles.widgetActions}>
          <div className={styles.iconsContainer} title="Reset" hidden>
            <img
              onClick={resetApp}
              className={styles.currentWidgetIcon}
              src={resetIcon}
              alt="Reset"
            />
          </div>
          <div className={styles.iconsContainer} title="Share">
            <img
              onClick={copyShareUrl}
              className={styles.currentWidgetIcon}
              src={shareIcon}
              alt="Share"
            />
          </div>
        </div>
        <h2 data-testid="city-name">{location}</h2>
        <img
          className={styles.icon}
          src={getWeatherIcon(icon)}
          alt={icon}
          loading="lazy"
        />
        <p className={styles.weatherText}>{description}</p>
        <h3 className={styles.weatherTemp}>{convertKelvinToCelsius(temp)}º</h3>
        <p className={styles.weatherText}>{mainDetail}</p>
      </div>
      <div className="weather-extra-wrapper">
        <div className="widget weather-extra bg-extra1">
          <p>
            <span className="weather-extra-label">Temp</span> |{" "}
            <span className="weather-extra-label">
              {convertKelvinToCelsius(temp)}º
            </span>
          </p>
          <p>
            <span className="weather-extra-label">Feels like</span> |{" "}
            <span className="weather-extra-label">
              {convertKelvinToCelsius(feels_like)}º
            </span>
          </p>
        </div>
        <div className="widget weather-extra bg-extra2">
          <p>
            <span className="weather-extra-label">Humidity</span> |{" "}
            <span className="weather-extra-label">{humidity}%</span>
          </p>
          <p>
            <span className="weather-extra-label">Pressure</span> |{" "}
            <span className="weather-extra-label">{pressure}</span>
          </p>
        </div>
        <div className="widget weather-extra bg-extra3">
          <p>
            <span className="weather-extra-label">Temp max</span> |{" "}
            <span className="weather-extra-label">
              {convertKelvinToCelsius(temp_max)}º
            </span>
          </p>
          <p>
            <span className="weather-extra-label">Temp min</span> |{" "}
            <span className="weather-extra-label">
              {convertKelvinToCelsius(temp_min)}º
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default CurrentWidget
