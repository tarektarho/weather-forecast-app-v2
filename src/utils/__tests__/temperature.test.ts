import {
  convertKelvinToFahrenheit,
  convertKelvinToCelsius,
} from "../temperature"

describe("utils/temperature", () => {
  describe("convertKelvinToFahrenheit", () => {
    it("returns a value converted", () => {
      const result = convertKelvinToFahrenheit(140)
      expect(result).toEqual(-207)
    })
  })

  describe("convertKelvinToCelsius", () => {
    it("returns a value converted", () => {
      const result = convertKelvinToCelsius(293.89)
      expect(result).toEqual(20)
    })
  })
})
