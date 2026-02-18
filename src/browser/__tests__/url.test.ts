import { getURLParam } from "../url"

describe("browser/url", () => {
  describe("getURLParam", () => {
    it("returns null when param does not exist", () => {
      const result = getURLParam("nonexistent")
      expect(result).toBeNull()
    })
  })
})
