/** Shared query argument interfaces for RTK Query endpoints. */

/** Query argument for endpoints that accept latitude and longitude. */
export interface LatLonQueryArg {
  lat: number
  lon: number
}

/** Query argument for endpoints that accept a city name. */
export interface CityQueryArg {
  city: string
}

/** Single result from the OpenWeather Geocoding API. */
export interface GeocodingResult {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

/** Shape of the error body returned by OpenWeather API responses. */
export interface ApiErrorData {
  cod?: number | string
  message?: string
}
