import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import CurrentWidgetSkeleton from "../CurrentWidgetSkeleton"

describe("CurrentWidgetSkeleton", () => {
  it("renders the skeleton with role attribute", () => {
    render(<CurrentWidgetSkeleton />)
    expect(screen.getByRole("current-widget-skeleton")).toBeInTheDocument()
  })

  it("renders three extra weather skeleton elements", () => {
    const { container } = render(<CurrentWidgetSkeleton />)
    const extras = container.querySelectorAll(
      ".weather-extra-wrapper .skeleton",
    )
    expect(extras.length).toBe(3)
  })
})
