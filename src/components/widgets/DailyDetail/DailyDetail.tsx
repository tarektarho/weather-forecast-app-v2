import React from "react"
import type { ForecastItem } from "../../../types/forecast"
import {
  convertKelvinToCelsius,
  getDay,
  getMonth,
  getHour,
  getWeatherIcon,
} from "../../../utils/index"
import styles from "./styles.module.scss"

interface DailyDetailProps {
  data: ForecastItem | null
}

const DailyDetail: React.FC<DailyDetailProps> = ({ data }) => {
  // Check if data is available, if not, return null
  if (!data) {
    return null
  }

  // Destructure relevant properties from the data
  const { dt, clouds, main, weather } = data

  return (
    <div className={`widget ${styles.dailyItem}`} data-testid="daily-item">
      <p className={styles.dailyText}>
        {getMonth(dt)} {getDay(dt)}
      </p>
      <p className={styles.dailyText}>{getHour(dt)}</p>
      <img
        className={styles.icon}
        src={getWeatherIcon(weather[0].icon)}
        alt={`Weather icon for ${weather[0].description}`}
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
