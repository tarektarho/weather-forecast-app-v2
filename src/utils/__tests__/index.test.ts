import * as Utils from "../index"

describe("Utils", () => {
  // Thu Aug 10 2023 22:43:42 GMT+0200 (Central European Summer Time)
  const unix_date = 1691700222

  afterAll(() => {
    localStorage.clear()
  })

  describe("getDay", () => {
    it("returns the day of the month from a unix timestamp datetime", () => {
      const result = Utils.getDay(unix_date)
      expect(result).toEqual(10)
    })
  })

  describe("getHour", () => {
    it("returns the hour of a date-time unix timestamp datetime value", () => {
      const result = Utils.getHour(unix_date)
      expect(result).toEqual("22:43:42")
    })
  })

  describe("getMonth", () => {
    it("returns the month from the unix timestamp value", () => {
      const result = Utils.getMonth(unix_date)
      expect(result).toEqual("Aug")
    })
  })

  describe("convertKelvinToFahrenheit", () => {
    it("returns a value converted", () => {
      const result = Utils.convertKelvinToFahrenheit(140)
      expect(result).toEqual(-207)
    })
  })

  describe("convertKelvinToCelsius", () => {
    it("returns a value converted", () => {
      const result = Utils.convertKelvinToCelsius(293.89)
      expect(result).toEqual(20)
    })
  })

  describe("getWeatherIcon", () => {
    it("returns an icon", () => {
      const iconName = "my_icon"
      const expected = `https://openweathermap.org/img/wn/${iconName}@2x.png`
      expect(Utils.getWeatherIcon(iconName)).toEqual(expected)
    })
  })

  describe("savePosition", () => {
    it("stores the lat and lon", () => {
      Utils.savePosition(100, 300)

      const lStorageResult = JSON.parse(
        localStorage.getItem("gps_position") || "",
      )
      expect(lStorageResult.lat).toEqual(100)
      expect(lStorageResult.lon).toEqual(300)
    })

    it("updates the existing localStorage lat and lon", () => {
      Utils.savePosition(100, 300)

      let lStorageResult = JSON.parse(
        localStorage.getItem("gps_position") || "",
      )
      expect(lStorageResult.lat).toEqual(100)
      expect(lStorageResult.lon).toEqual(300)

      Utils.savePosition(550, 300)
      lStorageResult = JSON.parse(localStorage.getItem("gps_position") || "")
      expect(lStorageResult.lat).toEqual(550)
      expect(lStorageResult.lon).toEqual(300)
    })
  })

  describe("setLocalStorageItem", () => {
    it("returns data from the localStorage", () => {
      Utils.setLocalStorageItem("user", "anagonm@gmail.com")
      let result = JSON.parse(localStorage.getItem("user") || "")
      expect(result).toEqual("anagonm@gmail.com")
    })
  })

  describe("getLocalStorageItem", () => {
    it("returns data from the localStorage", () => {
      Utils.setLocalStorageItem("name", "weatherapp")
      const result = Utils.getLocalStorageItem("name")
      expect(result).toEqual("weatherapp")
    })

    it("returns null if the value does not exists", () => {
      const result = Utils.getLocalStorageItem("my-key-value")
      expect(result).toEqual(null)
    })
  })

  describe("resetApp", () => {
    it("resets the data", () => {
      Utils.setLocalStorageItem("gps_position", { lat: 1, lon: 1 })
      let result = Utils.getLocalStorageItem("gps_position")
      expect(result).toEqual({ lat: 1, lon: 1 })

      Utils.resetApp()

      result = Utils.getLocalStorageItem("gps_position")
      expect(result).toEqual(null)
    })
  })

  describe("placeLinkIntoClipBoard", () => {
    it("rejects when location is null in localStorage", async () => {
      localStorage.clear()
      await expect(Utils.placeLinkIntoClipBoard()).rejects.toEqual(
        "Location is not available.",
      )
    })

    it("copies link to clipboard when location exists", async () => {
      Utils.setLocalStorageItem("gps_position", { lat: 52, lon: 5 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await Utils.placeLinkIntoClipBoard()

      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lat=52"),
      )
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lon=5"),
      )
    })

    it("uses explicit lat/lon params instead of localStorage", async () => {
      Utils.setLocalStorageItem("gps_position", { lat: 10, lon: 20 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await Utils.placeLinkIntoClipBoard(51.5, -0.12)

      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lat=51.5"),
      )
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lon=-0.12"),
      )
    })

    it("falls back to localStorage when only lat is provided", async () => {
      Utils.setLocalStorageItem("gps_position", { lat: 48, lon: 2 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await Utils.placeLinkIntoClipBoard(51.5, undefined)

      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lat=48"),
      )
      expect(writeTextMock).toHaveBeenCalledWith(
        expect.stringContaining("lon=2"),
      )
    })

    it("builds URL from origin + pathname without duplicating query params", async () => {
      Utils.setLocalStorageItem("gps_position", { lat: 52, lon: 5 })
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText: writeTextMock },
      })

      await Utils.placeLinkIntoClipBoard(52, 5)

      const copiedUrl = writeTextMock.mock.calls[0][0] as string
      // URL should contain exactly one '?'
      const questionMarkCount = (copiedUrl.match(/\?/g) || []).length
      expect(questionMarkCount).toBe(1)
    })
  })

  describe("getURLParam", () => {
    it("returns null when param does not exist", () => {
      const result = Utils.getURLParam("nonexistent")
      expect(result).toBeNull()
    })
  })

  describe("isValidCoordinates", () => {
    it("returns true for valid coordinates", () => {
      expect(Utils.isValidCoordinates(52.37, 4.89)).toBe(true)
    })

    it("returns true for boundary values", () => {
      expect(Utils.isValidCoordinates(90, 180)).toBe(true)
      expect(Utils.isValidCoordinates(-90, -180)).toBe(true)
      expect(Utils.isValidCoordinates(0, 0)).toBe(true)
    })

    it("returns false for out-of-range latitude", () => {
      expect(Utils.isValidCoordinates(91, 0)).toBe(false)
      expect(Utils.isValidCoordinates(-91, 0)).toBe(false)
    })

    it("returns false for out-of-range longitude", () => {
      expect(Utils.isValidCoordinates(0, 181)).toBe(false)
      expect(Utils.isValidCoordinates(0, -181)).toBe(false)
    })

    it("returns false for NaN values", () => {
      expect(Utils.isValidCoordinates(NaN, 5)).toBe(false)
      expect(Utils.isValidCoordinates(52, NaN)).toBe(false)
      expect(Utils.isValidCoordinates(NaN, NaN)).toBe(false)
    })

    it("returns false for Infinity values", () => {
      expect(Utils.isValidCoordinates(Infinity, 5)).toBe(false)
      expect(Utils.isValidCoordinates(52, -Infinity)).toBe(false)
    })
  })

  describe("getBrowserGeoPosition", () => {
    it("rejects when geolocation is not available", async () => {
      const originalGeolocation = navigator.geolocation
      Object.defineProperty(navigator, "geolocation", {
        value: undefined,
        writable: true,
        configurable: true,
      })

      await expect(Utils.getBrowserGeoPosition()).rejects.toThrow(
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

      const result = await Utils.getBrowserGeoPosition()
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

      await expect(Utils.getBrowserGeoPosition()).rejects.toThrow(
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

      await expect(Utils.getBrowserGeoPosition()).rejects.toThrow(
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

      await expect(Utils.getBrowserGeoPosition()).rejects.toThrow(
        "Geolocation error: 2",
      )
    })
  })

  describe("sleep", () => {
    it("is callable and has been mocked", () => {
      // sleep is globally mocked in setupTests.ts as vi.fn()
      Utils.sleep(1000)
      expect(Utils.sleep).toHaveBeenCalledWith(1000)
    })

    it("resolves after the specified delay (real implementation)", async () => {
      // Import the actual (unmocked) sleep to cover lines 193-194
      const actual = await vi.importActual<typeof Utils>("../../utils/index")

      vi.useFakeTimers()

      let resolved = false
      actual.sleep(500).then(() => {
        resolved = true
      })

      expect(resolved).toBe(false)

      await vi.advanceTimersByTimeAsync(499)
      expect(resolved).toBe(false)

      await vi.advanceTimersByTimeAsync(1)
      expect(resolved).toBe(true)

      vi.useRealTimers()
    })
  })
})
