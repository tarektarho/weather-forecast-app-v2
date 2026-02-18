import { useEffect, useState } from "react"
import type { FC, ReactNode } from "react"
import { useDispatch } from "react-redux"
import { WeatherContext } from "./weatherContext"
import {
  useGetWeatherByLatLonQuery,
  useGetWeatherByCityQuery,
} from "../api/weatherApi"
import {
  useGetForecastByLatLonQuery,
  useGetForecastByCityQuery,
} from "../api/forecastApi"
import {
  useGetAirPollutionByLatLonQuery,
  useGetAirPollutionByCityQuery,
} from "../api/airPollutionApi"
import { setError as setWeatherUiError } from "../features/weather/slice"
import * as Constants from "../utils/constants"
import { ERROR_BROWSER_GEOLOCATION_OFF } from "../utils/constants"
import { isValidCoordinates } from "../utils/geo"
import type { GpsPosition } from "../utils/geo"
import { getURLParam } from "../browser/url"
import { getLocalStorageItem, setLocalStorageItem } from "../browser/storage"
import { getBrowserGeoPosition } from "../browser/geolocation"
import { savePosition } from "../features/api/services/positionStorage"
import { placeLinkIntoClipBoard } from "../features/api/services/shareLink"
import type { AppDispatch } from "../store/types"

interface WeatherProviderProps {
  children: ReactNode
}

/**
 * Resolve initial coordinates synchronously from URL params or localStorage.
 * Runs once as a lazy state initializer — avoids setState inside an effect.
 */
function resolveInitialCoords(): { lat?: number; lon?: number } {
  const urlLat = getURLParam(Constants.URL_PARAM_LAT)
  const urlLon = getURLParam(Constants.URL_PARAM_LON)
  if (urlLat && urlLon) {
    const lat = Number(urlLat)
    const lon = Number(urlLon)
    if (isValidCoordinates(lat, lon)) {
      return { lat, lon }
    }
    // Invalid URL params — fall through to localStorage / geolocation
  }

  const stored = getLocalStorageItem(
    Constants.LOCAL_STORAGE_KEY_GPS_POSITION,
  ) as GpsPosition | null
  if (stored && isValidCoordinates(stored.lat, stored.lon)) {
    return { lat: stored.lat, lon: stored.lon }
  }

  return {}
}

export const WeatherProvider: FC<WeatherProviderProps> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  // Component states
  const [error, setError] = useState<string | undefined>(undefined)
  const [info, setInfo] = useState<string | undefined>(undefined)
  const [modal, setModal] = useState<boolean>(true)
  const [city, setCity] = useState<string>("")
  const [searchCity, setSearchCity] = useState<string>("")

  const [coords, setCoords] = useState<{
    lat?: number
    lon?: number
  }>(() => resolveInitialCoords())

  // RTK Query hooks – skip when args aren't ready
  const hasCoords =
    coords.lat !== undefined &&
    coords.lon !== undefined &&
    isValidCoordinates(coords.lat, coords.lon)
  const hasCity = searchCity !== ""

  const latLon = { lat: coords.lat ?? 0, lon: coords.lon ?? 0 }

  const weatherByLatLon = useGetWeatherByLatLonQuery(latLon, {
    skip: !hasCoords || hasCity,
  })
  const forecastByLatLon = useGetForecastByLatLonQuery(latLon, {
    skip: !hasCoords || hasCity,
  })
  const airPollutionByLatLon = useGetAirPollutionByLatLonQuery(latLon, {
    skip: !hasCoords || hasCity,
  })

  const weatherByCity = useGetWeatherByCityQuery(
    { city: searchCity },
    { skip: !hasCity },
  )
  const forecastByCity = useGetForecastByCityQuery(
    { city: searchCity },
    { skip: !hasCity },
  )
  const airPollutionByCity = useGetAirPollutionByCityQuery(
    { city: searchCity },
    { skip: !hasCity },
  )

  // Expose the active result set based on whether a city search is active
  const weatherData = hasCity ? weatherByCity : weatherByLatLon
  const forecastData = hasCity ? forecastByCity : forecastByLatLon
  const airPollutionData = hasCity ? airPollutionByCity : airPollutionByLatLon

  // Hide welcome modal and save to local storage
  const hideModal = () => {
    setModal((prevState) => !prevState)
    setLocalStorageItem(Constants.LOCAL_STORAGE_KEY_WELCOME_MODAL, true)
  }

  // Hide error notification and clear UI error state
  const hideError = () => {
    setError(undefined)
    dispatch(setWeatherUiError(false))
  }

  // Request browser geolocation only when no coords were resolved synchronously
  useEffect(() => {
    const initial = resolveInitialCoords()
    if (initial.lat !== undefined && initial.lon !== undefined) return

    const controller = new AbortController()

    getBrowserGeoPosition()
      .then(({ latitude, longitude }) => {
        if (controller.signal.aborted) return
        setCoords({ lat: latitude, lon: longitude })
        savePosition(latitude, longitude)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        if (err instanceof Error && err.message) {
          setError(String(err.message))
        } else {
          setError(ERROR_BROWSER_GEOLOCATION_OFF)
        }
      })

    return () => controller.abort()
  }, [])

  // Search weather and forecast data by city name
  const searchByCity = (cityParam?: string) => {
    const targetCity = cityParam || city
    if (targetCity && targetCity !== "") {
      setSearchCity(targetCity)
    }
  }

  // Copy and share URL — use coordinates from the active weather response
  // so that a city search shares the searched city, not the user's GPS location.
  const copyShareUrl = () => {
    const activeCoord = weatherData?.data?.coord
    placeLinkIntoClipBoard(activeCoord?.lat, activeCoord?.lon)
      .then(() => {
        setInfo(Constants.MESSAGE_URL_COPIED)
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : "Failed to copy URL")
      })
  }

  // Context value for WeatherContext
  const contextValue = {
    error,
    hideError,
    city,
    setCity,
    modal,
    hideModal,
    info,
    setInfo,
    weatherData,
    airPollutionData,
    forecastData,
    searchByCity,
    copyShareUrl,
    setError,
  }

  // Provide context to children components
  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  )
}
