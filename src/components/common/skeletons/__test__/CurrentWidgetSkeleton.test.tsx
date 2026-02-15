import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import CurrentWidgetSkeleton from "../CurrentWidgetSkeleton"

describe("CurrentWidgetSkeleton", () => {
  it("renders the skeleton with role attribute", () => {
    render(<CurrentWidgetSkeleton />)
    expect(screen.getByRole("current-widget-skeleton")).toBeInTheDocument()
  })

  it("renders four skeleton elements (1 detail + 3 extras)", () => {
    render(<CurrentWidgetSkeleton />)
    const skeletons = screen.getAllByTestId("skeleton-test-id")
    expect(skeletons).toHaveLength(4)
  })
})
