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
  })
})
