import type { FC } from "react"
import { useParams, Link } from "react-router-dom"
import { useWeather } from "../../providers/weatherContext"
import type { ForecastItem } from "../../types/forecast"
import type ForecastData from "../../types/forecast"
import { getDay, getMonth, getHour, getWeatherIcon } from "../../utils/date"
import { convertKelvinToCelsius } from "../../utils/temperature"
import styles from "./styles.module.scss"

/**
 * Forecast detail page showing extended information for a single forecast entry.
 *
 * Reads the forecast timestamp from the URL parameter `:dt` and looks it up
 * in the forecast data provided by {@link useWeather} context.
 *
 * @component
 */
const ForecastDetail: FC = () => {
  const { dt } = useParams<{ dt: string }>()
  const { forecastData, weatherData } = useWeather()

  const timezoneOffset = weatherData?.data?.timezone

  // Find the matching forecast item by timestamp
  const isForecastData = (data: unknown): data is ForecastData =>
    typeof data === "object" &&
    data !== null &&
    "list" in data &&
    Array.isArray((data as ForecastData).list)

  const item: ForecastItem | undefined =
    forecastData?.data && isForecastData(forecastData.data)
      ? forecastData.data.list.find((f) => String(f.dt) === dt)
      : undefined

  if (!item) {
    return (
      <div className={styles.container} data-testid="forecast-detail-empty">
        <Link to="/" className={styles.backLink} data-testid="back-link">
          ← Back to Dashboard
        </Link>
        <p className={styles.notFound}>
          Forecast data not available. Please go back and try again.
        </p>
      </div>
    )
  }

  const { main, weather, wind, clouds, visibility, pop, sys } = item
  const description = weather[0]?.description ?? ""
  const icon = weather[0]?.icon ?? ""

  return (
    <div className={styles.container} data-testid="forecast-detail">
      <Link to="/" className={styles.backLink} data-testid="back-link">
        ← Back to Dashboard
      </Link>

      <div className={styles.header}>
        <img
          src={getWeatherIcon(icon)}
          alt={`Weather icon for ${description}`}
          width={100}
          height={100}
        />
        <div>
          <h1 className={styles.date} data-testid="forecast-date">
            {getMonth(item.dt)} {getDay(item.dt)} —{" "}
            {getHour(item.dt, timezoneOffset)}
          </h1>
          <p className={styles.description} data-testid="forecast-description">
            {description}
          </p>
        </div>
      </div>

      <div className={styles.grid} data-testid="forecast-grid">
        <div className={styles.card}>
          <h2>Temperature</h2>
          <p className={styles.value}>{convertKelvinToCelsius(main.temp)}ºC</p>
          <ul className={styles.details}>
            <li>
              Feels like{" "}
              <strong>{convertKelvinToCelsius(main.feels_like)}ºC</strong>
            </li>
            <li>
              Min <strong>{convertKelvinToCelsius(main.temp_min)}ºC</strong>
            </li>
            <li>
              Max <strong>{convertKelvinToCelsius(main.temp_max)}ºC</strong>
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Wind</h2>
          <p className={styles.value}>{wind.speed} m/s</p>
          <ul className={styles.details}>
            <li>
              Direction <strong>{wind.deg}°</strong>
            </li>
            <li>
              Gust <strong>{wind.gust} m/s</strong>
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Atmosphere</h2>
          <ul className={styles.details}>
            <li>
              Humidity <strong>{main.humidity}%</strong>
            </li>
            <li>
              Pressure <strong>{main.pressure} hPa</strong>
            </li>
            <li>
              Sea level <strong>{main.sea_level} hPa</strong>
            </li>
            <li>
              Ground level <strong>{main.grnd_level} hPa</strong>
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Conditions</h2>
          <ul className={styles.details}>
            <li>
              Clouds <strong>{clouds.all}%</strong>
            </li>
            <li>
              Visibility <strong>{(visibility / 1000).toFixed(1)} km</strong>
            </li>
            <li>
              Rain probability <strong>{Math.round(pop * 100)}%</strong>
            </li>
            <li>
              Part of day{" "}
              <strong>{sys.pod === "d" ? "Day ☀️" : "Night 🌙"}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ForecastDetail
