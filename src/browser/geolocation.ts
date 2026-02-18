import { ERROR_BROWSER_GEOLOCATION_OFF } from "../utils/constants"

/**
 * Get the user's geo position using the browser's geolocation API.
 * @returns A promise that resolves with the latitude and longitude.
 * @throws ERROR_BROWSER_GEOLOCATION_OFF if geolocation is not available.
 */
export const getBrowserGeoPosition = (): Promise<{
  latitude: number
  longitude: number
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error(ERROR_BROWSER_GEOLOCATION_OFF))
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (latitude !== undefined && longitude !== undefined) {
          return resolve({ latitude, longitude })
        } else {
          return reject(new Error("Geolocation position is undefined."))
        }
      },
      (error) => {
        const errorMessage = error.message || `Geolocation error: ${error.code}`
        return reject(new Error(errorMessage))
      },
    )
  })
}
