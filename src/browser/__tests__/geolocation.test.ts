import { getBrowserGeoPosition } from "../geolocation"

describe("browser/geolocation", () => {
  describe("getBrowserGeoPosition", () => {
    it("rejects when geolocation is not available", async () => {
      const originalGeolocation = navigator.geolocation
      Object.defineProperty(navigator, "geolocation", {
        value: undefined,
        writable: true,
        configurable: true,
      })

      await expect(getBrowserGeoPosition()).rejects.toThrow(
        "It seems like your browser does not support HTML5 geolocation",
      )

      Object.defineProperty(navigator, "geolocation", {
        value: originalGeolocation,
        writable: true,
        configurable: true,
      })
    })

    it("resolves with latitude and longitude on success", async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => {
          success({
            coords: { latitude: 52.1, longitude: 5.05 },
          })
        }),
      }
      Object.defineProperty(navigator, "geolocation", {
        value: mockGeolocation,
        writable: true,
        configurable: true,
      })

      const result = await getBrowserGeoPosition()
      expect(result).toEqual({ latitude: 52.1, longitude: 5.05 })
    })

    it("rejects when geolocation position is undefined", async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => {
          success({
            coords: { latitude: undefined, longitude: undefined },
          })
        }),
      }
      Object.defineProperty(navigator, "geolocation", {
        value: mockGeolocation,
        writable: true,
        configurable: true,
      })

      await expect(getBrowserGeoPosition()).rejects.toThrow(
        "Geolocation position is undefined.",
      )
    })

    it("rejects with error message on geolocation error", async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_success, error) => {
          error({ message: "User denied geolocation", code: 1 })
        }),
      }
      Object.defineProperty(navigator, "geolocation", {
        value: mockGeolocation,
        writable: true,
        configurable: true,
      })

      await expect(getBrowserGeoPosition()).rejects.toThrow(
        "User denied geolocation",
      )
    })

    it("rejects with code-based error when no message", async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_success, error) => {
          error({ message: "", code: 2 })
        }),
      }
      Object.defineProperty(navigator, "geolocation", {
        value: mockGeolocation,
        writable: true,
        configurable: true,
      })

      await expect(getBrowserGeoPosition()).rejects.toThrow(
        "Geolocation error: 2",
      )
    })
  })
})
