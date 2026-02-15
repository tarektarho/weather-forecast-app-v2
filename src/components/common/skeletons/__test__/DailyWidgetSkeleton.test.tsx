import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import DailyWidgetSkeleton from "../DailyWidgetSkeleton"

describe("DailyWidgetSkeleton", () => {
  it("renders the forecast title skeleton with role", () => {
    render(<DailyWidgetSkeleton />)
    expect(screen.getByRole("daily-widget-skeleton")).toBeInTheDocument()
  })

  it("renders 7 daily-item skeleton placeholders", () => {
    const { container } = render(<DailyWidgetSkeleton />)
    const items = container.querySelectorAll(".daily-wrapper .skeleton")
    expect(items.length).toBe(7)
  })
})
