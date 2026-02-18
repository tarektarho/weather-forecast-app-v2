/**
 * Get the day of the month from a UNIX timestamp.
 * @param date - UNIX timestamp.
 * @returns The day of the month.
 */
export const getDay = (date: number): number => new Date(date * 1000).getDate()

/**
 * Get the hour with time zone conversion.
 * @param date - UNIX timestamp.
 * @param timezoneOffset - Optional UTC offset in seconds (from the OpenWeatherMap API).
 *                         When provided, the time is shown in the queried city's local time.
 *                         When omitted, the user's browser timezone is used.
 * @returns The formatted time.
 */
export const getHour = (date: number, timezoneOffset?: number): string => {
  if (timezoneOffset !== undefined) {
    // Shift the timestamp by the city's UTC offset and format in UTC
    const adjustedDate = new Date((date + timezoneOffset) * 1000)
    return adjustedDate.toLocaleTimeString("en-GB", { timeZone: "UTC" })
  }
  // Fall back to the user's browser timezone
  return new Date(date * 1000).toLocaleTimeString("en-GB")
}

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
