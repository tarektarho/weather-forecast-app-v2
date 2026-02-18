import {
  LOCAL_STORAGE_KEY_GPS_POSITION,
  LOCAL_STORAGE_KEY_WELCOME_MODAL,
  URL_PARAM_LAT,
  URL_PARAM_LON,
} from "../../../utils/constants"
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../../browser/storage"
import { writeToClipboard } from "../../../browser/clipboard"
import { isGpsPosition } from "../../../utils/geo"

/**
 * Reset the app's state and remove URL parameters.
 */
export const resetApp = (): void => {
  window.location.href = window.location.href.split("?")[0] // remove params from URL if any
  setLocalStorageItem(LOCAL_STORAGE_KEY_GPS_POSITION, null)
  setLocalStorageItem(LOCAL_STORAGE_KEY_WELCOME_MODAL, null)
}

/**
 * Copy the app's link with GPS coordinates to clipboard.
 * Uses the provided coordinates (e.g. from the active weather result),
 * falling back to localStorage if none are given.
 * @param lat - Optional latitude override.
 * @param lon - Optional longitude override.
 * @returns A promise that resolves when copying is successful.
 */
export const placeLinkIntoClipBoard = (
  lat?: number,
  lon?: number,
): Promise<void> => {
  if (lat === undefined || lon === undefined) {
    const location = getLocalStorageItem(LOCAL_STORAGE_KEY_GPS_POSITION)
    if (!isGpsPosition(location)) {
      return Promise.reject("Location is not available.")
    }
    lat = location.lat
    lon = location.lon
  }

  const baseUrl = `${window.location.origin}${window.location.pathname}`
  const link = `${baseUrl}?${URL_PARAM_LAT}=${lat}&${URL_PARAM_LON}=${lon}`
  return writeToClipboard(link)
}
