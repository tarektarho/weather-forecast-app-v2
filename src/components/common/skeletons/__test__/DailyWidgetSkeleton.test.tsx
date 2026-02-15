import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import DailyWidgetSkeleton from "../DailyWidgetSkeleton"

describe("DailyWidgetSkeleton", () => {
  it("renders the forecast title skeleton with role", () => {
    render(<DailyWidgetSkeleton />)
    expect(screen.getByRole("daily-widget-skeleton")).toBeInTheDocument()
  })

  it("renders 7 daily-item skeleton placeholders", () => {
    render(<DailyWidgetSkeleton />)
    // 1 forecast-title skeleton + 7 daily-item skeletons = 8 total
    const skeletons = screen.getAllByTestId("skeleton-test-id")
    expect(skeletons).toHaveLength(8)
  })
})
