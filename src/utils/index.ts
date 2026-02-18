// Browser APIs
export { writeToClipboard } from "../browser/clipboard"
export { setLocalStorageItem, getLocalStorageItem } from "../browser/storage"
export { getURLParam } from "../browser/url"
export { getBrowserGeoPosition } from "../browser/geolocation"

// Utils
export { isGpsPosition, isValidCoordinates } from "./geo"
export type { GpsPosition } from "./geo"
export {
  convertKelvinToFahrenheit,
  convertKelvinToCelsius,
} from "./temperature"
export { getDay, getHour, getMonth, getWeatherIcon } from "./date"
export { sleep } from "./sleep"

// Features
export { savePosition } from "../features/api/services/positionStorage"
export {
  placeLinkIntoClipBoard,
  resetApp,
} from "../features/api/services/shareLink"
