import { savePosition } from "../positionStorage"
import { setLocalStorageItem } from "../../../../browser/storage"

// We need to read localStorage directly for assertions
describe("features/api/services/positionStorage", () => {
  afterAll(() => {
    localStorage.clear()
  })

  describe("savePosition", () => {
    it("stores the lat and lon", () => {
      savePosition(100, 300)

      const lStorageResult = JSON.parse(
        localStorage.getItem("gps_position") || "",
      )
      expect(lStorageResult.lat).toEqual(100)
      expect(lStorageResult.lon).toEqual(300)
    })

    it("updates the existing localStorage lat and lon", () => {
      savePosition(100, 300)

      let lStorageResult = JSON.parse(
        localStorage.getItem("gps_position") || "",
      )
      expect(lStorageResult.lat).toEqual(100)
      expect(lStorageResult.lon).toEqual(300)

      savePosition(550, 300)
      lStorageResult = JSON.parse(localStorage.getItem("gps_position") || "")
      expect(lStorageResult.lat).toEqual(550)
      expect(lStorageResult.lon).toEqual(300)
    })

    it("does not overwrite when lat and lon are unchanged", () => {
      savePosition(42, 13)
      const spy = vi.spyOn(Storage.prototype, "setItem")

      savePosition(42, 13)

      // setItem should not have been called since coords didn't change
      expect(spy).not.toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
