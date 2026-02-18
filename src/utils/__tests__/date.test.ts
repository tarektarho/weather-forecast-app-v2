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
    it("returns the hour of a date-time unix timestamp datetime value", () => {
      const result = getHour(unix_date)
      expect(result).toEqual("22:43:42")
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
