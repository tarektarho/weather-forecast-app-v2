import { setLocalStorageItem, getLocalStorageItem } from "../storage"

describe("browser/storage", () => {
  afterAll(() => {
    localStorage.clear()
  })

  describe("setLocalStorageItem", () => {
    it("stores a value in localStorage", () => {
      setLocalStorageItem("user", "anagonm@gmail.com")
      const result = JSON.parse(localStorage.getItem("user") || "")
      expect(result).toEqual("anagonm@gmail.com")
    })
  })

  describe("getLocalStorageItem", () => {
    it("returns data from localStorage", () => {
      setLocalStorageItem("name", "weatherapp")
      const result = getLocalStorageItem("name")
      expect(result).toEqual("weatherapp")
    })

    it("returns null if the value does not exist", () => {
      const result = getLocalStorageItem("my-key-value")
      expect(result).toEqual(null)
    })

    it("returns null and removes the item when stored value is corrupted non-JSON", () => {
      // Manually set a non-JSON string that will cause JSON.parse to throw
      localStorage.setItem("corrupted", "not-valid-json{{{")
      const result = getLocalStorageItem("corrupted")
      expect(result).toEqual(null)
      // The corrupted item should have been removed
      expect(localStorage.getItem("corrupted")).toBeNull()
    })
  })
})
