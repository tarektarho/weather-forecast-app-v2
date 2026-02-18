import type { FC, ReactElement } from "react"
import type { ForecastItem } from "../../../types/forecast"
import { convertKelvinToCelsius } from "../../../utils/temperature"
import { getDay, getMonth, getHour, getWeatherIcon } from "../../../utils/date"
import shared from "../../../styles/shared.module.scss"
import styles from "./styles.module.scss"

interface DailyDetailProps {
  data: ForecastItem | null
  timezoneOffset?: number
}

/**
 * Displays detailed weather information for a specific day.
 *
 * @component
 * @example
 * const data = {
 *   dt: 1609459200,
 *   clouds: { all: 50 },
 *   main: { temp: 288.15 },
 *   weather: [{ icon: '01d', description: 'clear sky' }]
 * };
 * return <DailyDetail data={data} timezoneOffset={3600} />
 *
 * @param props - The component props
 * @param props.data - The weather data object containing date, clouds, temperature, and weather conditions
 * @param props.data.dt - Unix timestamp of the weather data
 * @param props.data.clouds - Cloud information with percentage coverage
 * @param props.data.main - Temperature data in Kelvin
 * @param props.data.weather - Array of weather condition objects with icon and description
 * @param props.timezoneOffset - The timezone offset in seconds to calculate the correct local time
 * @returns {React.ReactElement | null} The rendered daily weather detail widget, or null if data is not available
 */
const DailyDetail: FC<DailyDetailProps> = ({
  data,
  timezoneOffset,
}): ReactElement | null => {
  // Check if data is available, if not, return null
  if (!data) {
    return null
  }

  // Destructure relevant properties from the data
  const { dt, clouds, main, weather } = data

  return (
    <div
      className={`${shared.widget} ${styles.dailyItem}`}
      data-testid="daily-item"
    >
      <p className={styles.dailyText}>
        {getMonth(dt)} {getDay(dt)}
      </p>
      <p className={styles.dailyText}>{getHour(dt, timezoneOffset)}</p>
      <img
        className={styles.icon}
        src={getWeatherIcon(weather[0].icon)}
        alt={`Weather icon for ${weather[0].description}`}
        loading="lazy"
      />
      <h3 className={styles.dailyTemp}>{convertKelvinToCelsius(main.temp)}º</h3>
      <p className={styles.dailyText}>Clouds | {clouds.all}%</p>
      <p className={styles.dailyText} data-testid="daily-description">
        {weather[0].description}
      </p>
    </div>
  )
}

export default DailyDetail
