import { describe, it, expect } from "vitest"
import { store } from "../store"

describe("store", () => {
  it("is defined and has required state slices", () => {
    const state = store.getState()

    expect(state).toBeDefined()
    expect(state.weatherUi).toEqual({ error: false })
    expect(state.api).toBeDefined()
  })

  it("has dispatch function", () => {
    expect(typeof store.dispatch).toBe("function")
  })

  it("has getState function", () => {
    expect(typeof store.getState).toBe("function")
  })
})
