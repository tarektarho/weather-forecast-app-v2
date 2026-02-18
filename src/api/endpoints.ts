import { GEO_URL } from "../utils/constants"

export const weatherEndpoints = {
  byLatLon: (lat: number, lon: number): string =>
    `/weather?lat=${lat}&lon=${lon}`,
  byCity: (city: string): string => `/weather?q=${encodeURIComponent(city)}`,
}

export const forecastEndpoints = {
  byLatLon: (lat: number, lon: number): string =>
    `/forecast?lat=${lat}&lon=${lon}`,
  byCity: (city: string): string => `/forecast?q=${encodeURIComponent(city)}`,
}

export const airPollutionEndpoints = {
  byLatLon: (lat: number, lon: number): string =>
    `/air_pollution?lat=${lat}&lon=${lon}`,
}

export const geoEndpoints = {
  directByCity: (city: string, limit = 1): string =>
    `${GEO_URL}?q=${encodeURIComponent(city)}&limit=${limit}`,
}
