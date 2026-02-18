/**
 * Get the day of the month from a UNIX timestamp.
 * @param date - UNIX timestamp.
 * @returns The day of the month.
 */
export const getDay = (date: number): number => new Date(date * 1000).getDate()

/**
 * Get the hour in 12-hour format with time zone conversion.
 * @param date - UNIX timestamp.
 * @returns The formatted time.
 */
export const getHour = (date: number): string =>
  new Date(date * 1000).toLocaleTimeString("en-GB", {
    timeZone: "Europe/Amsterdam", // Todo set the time zone dynamically from the user current location
  })

/**
 * Get the short name of the month from a UNIX timestamp.
 * @param date - UNIX timestamp.
 * @returns The short name of the month.
 */
export const getMonth = (date: number): string => {
  return new Date(date * 1000).toLocaleString("default", { month: "short" })
}

/**
 * Get the URL for a weather icon based on the icon code.
 * @param icon - Icon code.
 * @returns URL of the weather icon.
 */
export const getWeatherIcon = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}
