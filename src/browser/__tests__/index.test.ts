import { describe, it, expect } from "vitest"
import {
  writeToClipboard,
  setLocalStorageItem,
  getLocalStorageItem,
  getURLParam,
  getBrowserGeoPosition,
} from "../index"

describe("browser/index barrel exports", () => {
  it("re-exports writeToClipboard", () => {
    expect(writeToClipboard).toBeDefined()
    expect(typeof writeToClipboard).toBe("function")
  })

  it("re-exports setLocalStorageItem", () => {
    expect(setLocalStorageItem).toBeDefined()
    expect(typeof setLocalStorageItem).toBe("function")
  })

  it("re-exports getLocalStorageItem", () => {
    expect(getLocalStorageItem).toBeDefined()
    expect(typeof getLocalStorageItem).toBe("function")
  })

  it("re-exports getURLParam", () => {
    expect(getURLParam).toBeDefined()
    expect(typeof getURLParam).toBe("function")
  })

  it("re-exports getBrowserGeoPosition", () => {
    expect(getBrowserGeoPosition).toBeDefined()
    expect(typeof getBrowserGeoPosition).toBe("function")
  })
})
