import { LOCAL_STORAGE_KEY_GPS_POSITION } from "../../../utils/constants"
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../../browser/storage"
import { isGpsPosition } from "../../../utils/geo"
import type { GpsPosition } from "../../../utils/geo"

/**
 * Save GPS coordinates to local storage.
 * @param lat - Latitude.
 * @param lon - Longitude.
 */
export const savePosition = (lat: number, lon: number) => {
  const position = getLocalStorageItem(LOCAL_STORAGE_KEY_GPS_POSITION)
  const coordinates: GpsPosition = { lat, lon }

  if (isGpsPosition(position)) {
    if (position.lat !== lat || position.lon !== lon) {
      setLocalStorageItem(LOCAL_STORAGE_KEY_GPS_POSITION, coordinates)
    }
  } else {
    setLocalStorageItem(LOCAL_STORAGE_KEY_GPS_POSITION, coordinates)
  }
}
