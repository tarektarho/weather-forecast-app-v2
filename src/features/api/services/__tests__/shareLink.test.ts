import { placeLinkIntoClipBoard, resetApp } from "../shareLink"
import {
  setLocalStorageItem,
  getLocalStorageItem,
} from "../../../../browser/storage"

describe("features/api/services/shareLink", () => {
  afterEach(() => {
    localStorage.clear()
  })

  describe("resetApp", () => {
    it("resets the data", () => {
      setLocalStorageItem("gps_position", { lat: 1, lon: 1 })
      let result = getLocalStorageItem("gps_position")
      expect(result).toEqual({ lat: 1, lon: 1 })

      resetApp()

      result = getLocalStorageItem("gps_position")
      expect(result).toEqual(null)
    })
  })

  describe("placeLinkIntoClipBoard", () => {
    it("rejects when location is null in localStorage", async () => {
      localStorage.clear()
      await expect(placeLinkIntoClipBoard()).rejects.toEqual(
        "Location is not available.",
      )
    })

    it("copies link to clipboard when location exists in localStorage", async () => {
      setLocalStorageItem("gps_position", { lat: 52, lon: 5 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await placeLinkIntoClipBoard()

      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lat=52"),
      )
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lon=5"),
      )
    })

    it("uses explicit lat/lon params instead of localStorage", async () => {
      setLocalStorageItem("gps_position", { lat: 10, lon: 20 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await placeLinkIntoClipBoard(51.5, -0.12)

      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lat=51.5"),
      )
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lon=-0.12"),
      )
    })

    it("falls back to localStorage when only lat is provided", async () => {
      setLocalStorageItem("gps_position", { lat: 48, lon: 2 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await placeLinkIntoClipBoard(51.5, undefined)

      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lat=48"),
      )
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lon=2"),
      )
    })

    it("builds URL from origin + pathname without duplicating query params", async () => {
      setLocalStorageItem("gps_position", { lat: 52, lon: 5 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await placeLinkIntoClipBoard(52, 5)

      const copiedUrl = writeTextMock.mock.calls[0][0] as string
      // URL should contain exactly one '?'
      const questionMarkCount = (copiedUrl.match(/\?/g) || []).length
      expect(questionMarkCount).toBe(1)
    })
  })
})
