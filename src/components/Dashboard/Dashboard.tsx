import React from "react"
import styles from "./styles.module.scss"
import { LOCAL_STORAGE_KEY_WELCOME_MODAL } from "../../utils/constants"
import { useWeather } from "../../providers/weatherContext"
import CurrentWidget from "../widgets/CurrentWidget/CurrentWidget"
import DailyWidget from "../widgets/DailyWidget/DailyWidget"
import AdditionalWidget from "../widgets/AdditionalWidget/AdditionalWidget"
import AirPollutionWidget from "../widgets/AirPollutionWidget/AirPollutionWidget"
import Notification from "../Notification/Notification"
import Search from "../Search/Search"
import Modal from "../Modal/Modal"
import { getLocalStorageItem } from "../../utils"

const Dashboard: React.FC = () => {
  // Fetch necessary data and functions from the WeatherContext
  const { modal, hideModal, weatherData, error, hideError, info, setInfo } =
    useWeather()

  // React 19: Extract weather info for document metadata
  const weatherInfo = weatherData?.data
  const hasWeatherData = weatherInfo && Object.keys(weatherInfo).length > 0
  const locationName = hasWeatherData ? weatherInfo.name : null
  const weatherDescription = hasWeatherData
    ? weatherInfo.weather?.[0]?.description
    : null

  // Render an error notification if there's an error message
  const renderErrorIfAny = () => {
    const weatherError = weatherData?.error
      ? typeof weatherData.error === "object" &&
        weatherData.error !== null &&
        "data" in weatherData.error
        ? String((weatherData.error as { data: unknown }).data)
        : "An error occurred"
      : undefined
    const currentError = weatherError || error
    if (currentError) {
      return (
        <Notification
          message={currentError}
          hideNotification={hideError}
          type="error"
        />
      )
    }
  }

  // Render an info notification if there's an info message
  const renderNotificationIfAny = () => {
    if (info) {
      return (
        <Notification
          message={info}
          hideNotification={() => setInfo(undefined)}
          type="info"
        />
      )
    }
  }

  // Render the welcome modal if it's required
  const renderModalIfNeeded = () => {
    if (!modal) {
      return
    }

    const welcomeModal = getLocalStorageItem(LOCAL_STORAGE_KEY_WELCOME_MODAL)
    if (!welcomeModal) {
      return <Modal hideModal={hideModal} />
    }
  }

  return (
    <div className={styles.mainContainer} data-testid="main-container">
      {/* React 19: Document metadata for SEO - automatically hoisted to <head> */}
      <title>
        {locationName
          ? `Weather in ${locationName} - WeatherApp`
          : "WeatherApp - Real-time Weather Forecast"}
      </title>
      <meta
        name="description"
        content={
          weatherDescription
            ? `Current weather: ${weatherDescription}. Get real-time weather forecasts, air pollution data, and 5-day forecasts.`
            : "Get real-time weather forecasts, air pollution data, and 5-day weather forecasts for any location."
        }
      />
      <div className={styles.mainWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.mainTitle}>
            <Search />
            <div className={styles.title}>
              <h1>WeatherApp</h1>
            </div>
          </div>
          {/* Forecast 5 days */}
          <DailyWidget />
          <div className={styles.flexWrapper}>
            {/* More data from OpenWeather */}
            <div className="flex-item widget">
              <AdditionalWidget />
            </div>
            {/* AirPollution */}
            <div className="flex-item widget">
              <AirPollutionWidget />
            </div>
          </div>
        </div>
        {/* Current weather detail */}
        <div className={styles.detailContent}>
          <CurrentWidget />
        </div>
      </div>

      {renderErrorIfAny()}
      {renderModalIfNeeded()}
      {renderNotificationIfAny()}
    </div>
  )
}

export default Dashboard
