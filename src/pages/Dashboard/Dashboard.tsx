import type { FC } from "react"
import styles from "./styles.module.scss"
import { LOCAL_STORAGE_KEY_WELCOME_MODAL } from "../../utils/constants"
import { useWeather } from "../../providers/weatherContext"
import CurrentWidget from "../../components/widgets/CurrentWidget/CurrentWidget"
import DailyWidget from "../../components/widgets/DailyWidget/DailyWidget"
import AdditionalWidget from "../../components/widgets/AdditionalWidget/AdditionalWidget"
import AirPollutionWidget from "../../components/widgets/AirPollutionWidget/AirPollutionWidget"
import WidgetContainer from "../../components/common/WidgetContainer/WidgetContainer"
import Notification from "../../components/Notification/Notification"
import Search from "../../components/Search/Search"
import Modal from "../../components/Modal/Modal"
import { getLocalStorageItem } from "../../browser/storage"

/**
 * Main dashboard page that composes all weather-related widgets.
 *
 * Displays the search bar, current weather, 5-day forecast, sunrise/sunset
 * information, and air pollution data. Also manages error / info notifications
 * and a first-visit welcome modal.
 *
 * @component
 */
const Dashboard: FC = () => {
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
            <WidgetContainer flexItem>
              <AdditionalWidget />
            </WidgetContainer>
            {/* AirPollution */}
            <WidgetContainer flexItem>
              <AirPollutionWidget />
            </WidgetContainer>
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
