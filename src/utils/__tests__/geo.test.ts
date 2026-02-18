import { isValidCoordinates } from "../geo"

describe("utils/geo", () => {
  describe("isValidCoordinates", () => {
    it("returns true for valid coordinates", () => {
      expect(isValidCoordinates(52.37, 4.89)).toBe(true)
    })

    it("returns true for boundary values", () => {
      expect(isValidCoordinates(90, 180)).toBe(true)
      expect(isValidCoordinates(-90, -180)).toBe(true)
      expect(isValidCoordinates(0, 0)).toBe(true)
    })

    it("returns false for out-of-range latitude", () => {
      expect(isValidCoordinates(91, 0)).toBe(false)
      expect(isValidCoordinates(-91, 0)).toBe(false)
    })

    it("returns false for out-of-range longitude", () => {
      expect(isValidCoordinates(0, 181)).toBe(false)
      expect(isValidCoordinates(0, -181)).toBe(false)
    })

    it("returns false for NaN values", () => {
      expect(isValidCoordinates(NaN, 5)).toBe(false)
      expect(isValidCoordinates(52, NaN)).toBe(false)
      expect(isValidCoordinates(NaN, NaN)).toBe(false)
    })

    it("returns false for Infinity values", () => {
      expect(isValidCoordinates(Infinity, 5)).toBe(false)
      expect(isValidCoordinates(52, -Infinity)).toBe(false)
    })
  })
})
