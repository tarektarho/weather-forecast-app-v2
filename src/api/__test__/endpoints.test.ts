import { describe, it, expect } from "vitest"
import {
  weatherEndpoints,
  forecastEndpoints,
  airPollutionEndpoints,
  geoEndpoints,
} from "../endpoints"

describe("weatherEndpoints", () => {
  it("byLatLon builds correct path", () => {
    expect(weatherEndpoints.byLatLon(52.37, 4.89)).toBe(
      "/weather?lat=52.37&lon=4.89",
    )
  })

  it("byCity builds correct path", () => {
    expect(weatherEndpoints.byCity("Amsterdam")).toBe("/weather?q=Amsterdam")
  })

  it("byCity encodes special characters", () => {
    expect(weatherEndpoints.byCity("New York")).toBe("/weather?q=New%20York")
  })
})

describe("forecastEndpoints", () => {
  it("byLatLon builds correct path", () => {
    expect(forecastEndpoints.byLatLon(48.85, 2.35)).toBe(
      "/forecast?lat=48.85&lon=2.35",
    )
  })

  it("byCity builds correct path", () => {
    expect(forecastEndpoints.byCity("Paris")).toBe("/forecast?q=Paris")
  })

  it("byCity encodes special characters", () => {
    expect(forecastEndpoints.byCity("São Paulo")).toBe(
      "/forecast?q=S%C3%A3o%20Paulo",
    )
  })
})

describe("airPollutionEndpoints", () => {
  it("byLatLon builds correct path", () => {
    expect(airPollutionEndpoints.byLatLon(40.71, -74.0)).toBe(
      "/air_pollution?lat=40.71&lon=-74",
    )
  })
})

describe("geoEndpoints", () => {
  it("directByCity builds correct URL with default limit", () => {
    const url = geoEndpoints.directByCity("London")
    expect(url).toContain("q=London")
    expect(url).toContain("limit=1")
  })

  it("directByCity builds correct URL with custom limit", () => {
    const url = geoEndpoints.directByCity("Berlin", 5)
    expect(url).toContain("q=Berlin")
    expect(url).toContain("limit=5")
  })

  it("directByCity encodes city name", () => {
    const url = geoEndpoints.directByCity("Rio de Janeiro")
    expect(url).toContain("q=Rio%20de%20Janeiro")
  })
})
