import { GEO_URL } from "../utils/constants"

const buildWeatherPath = (path: string) => `${path}`

export const weatherEndpoints = {
  byLatLon: (lat: number, lon: number) =>
    buildWeatherPath(`/weather?lat=${lat}&lon=${lon}`),
  byCity: (city: string) =>
    buildWeatherPath(`/weather?q=${encodeURIComponent(city)}`),
}

export const forecastEndpoints = {
  byLatLon: (lat: number, lon: number) =>
    buildWeatherPath(`/forecast?lat=${lat}&lon=${lon}`),
  byCity: (city: string) =>
    buildWeatherPath(`/forecast?q=${encodeURIComponent(city)}`),
}

export const airPollutionEndpoints = {
  byLatLon: (lat: number, lon: number) =>
    buildWeatherPath(`/air_pollution?lat=${lat}&lon=${lon}`),
}

export const geoEndpoints = {
  directByCity: (city: string, limit = 1) =>
    `${GEO_URL}?q=${encodeURIComponent(city)}&limit=${limit}`,
}
