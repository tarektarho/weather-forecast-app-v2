import { getDay, getHour, getMonth, getWeatherIcon } from "../date"

describe("utils/date", () => {
  // Thu Aug 10 2023 22:43:42 GMT+0200 (Central European Summer Time)
  const unix_date = 1691700222

  describe("getDay", () => {
    it("returns the day of the month from a unix timestamp datetime", () => {
      const result = getDay(unix_date)
      expect(result).toEqual(10)
    })
  })

  describe("getHour", () => {
    it("returns the hour of a date-time unix timestamp datetime value using browser timezone", () => {
      const result = getHour(unix_date)
      // Without timezoneOffset, falls back to the browser's local timezone
      expect(result).toBeDefined()
      expect(typeof result).toBe("string")
    })

    it("returns the hour adjusted by timezoneOffset when provided", () => {
      // unix_date = 1691700222 → UTC 20:43:42
      // timezoneOffset = 3600 (UTC+1) → 21:43:42
      const result = getHour(unix_date, 3600)
      expect(result).toEqual("21:43:42")
    })

    it("handles a negative timezoneOffset", () => {
      // timezoneOffset = -18000 (UTC-5) → 15:43:42
      const result = getHour(unix_date, -18000)
      expect(result).toEqual("15:43:42")
    })

    it("handles zero timezoneOffset (UTC)", () => {
      // timezoneOffset = 0 → 20:43:42 UTC
      const result = getHour(unix_date, 0)
      expect(result).toEqual("20:43:42")
    })
  })

  describe("getMonth", () => {
    it("returns the month from the unix timestamp value", () => {
      const result = getMonth(unix_date)
      expect(result).toEqual("Aug")
    })
  })

  describe("getWeatherIcon", () => {
    it("returns an icon", () => {
      const iconName = "my_icon"
      const expected = `https://openweathermap.org/img/wn/${iconName}@2x.png`
      expect(getWeatherIcon(iconName)).toEqual(expected)
    })
  })
})
