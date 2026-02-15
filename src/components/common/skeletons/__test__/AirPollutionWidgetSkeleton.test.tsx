import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import AirPollutionWidgetSkeleton from "../AirPollutionWidgetSkeleton"

describe("AirPollutionWidgetSkeleton", () => {
  it("renders skeleton title elements", () => {
    const { container } = render(<AirPollutionWidgetSkeleton />)
    const titles = container.querySelectorAll(".air-title .skeleton")
    expect(titles.length).toBe(2)
  })

  it("renders 8 air-data skeleton placeholders", () => {
    const { container } = render(<AirPollutionWidgetSkeleton />)
    const items = container.querySelectorAll(".flex-wrap .air-data")
    expect(items.length).toBe(8)
  })
})
