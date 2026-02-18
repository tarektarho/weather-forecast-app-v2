/** GPS coordinates stored in local storage. */
export interface GpsPosition {
  lat: number
  lon: number
}

/** Type guard for GpsPosition. */
export const isGpsPosition = (value: unknown): value is GpsPosition => {
  return (
    typeof value === "object" &&
    value !== null &&
    "lat" in value &&
    "lon" in value &&
    typeof (value as GpsPosition).lat === "number" &&
    typeof (value as GpsPosition).lon === "number"
  )
}

/**
 * Validate that latitude and longitude values are within valid ranges.
 * @param lat - Latitude (-90 to 90).
 * @param lon - Longitude (-180 to 180).
 * @returns True if coordinates are valid.
 */
export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return (
    !isNaN(lat) &&
    !isNaN(lon) &&
    isFinite(lat) &&
    isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  )
}
