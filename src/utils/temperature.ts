/**
 * Convert temperature from Kelvin to Fahrenheit.
 * @param k - Temperature in Kelvin.
 * @returns Temperature in Fahrenheit.
 */
export const convertKelvinToFahrenheit = (k: number): number => {
  return Math.trunc((k - 273.15) * 1.8 + 32)
}

/**
 * Convert temperature from Kelvin to Celsius.
 * @param k - Temperature in Kelvin.
 * @returns Temperature in Celsius.
 */
export const convertKelvinToCelsius = (k: number): number => {
  return Math.trunc(k - 273.15)
}
