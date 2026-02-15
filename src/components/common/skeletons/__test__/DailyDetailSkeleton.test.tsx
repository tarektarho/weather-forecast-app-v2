import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import DailyDetailSkeleton from "../DailyDetailSkeleton"

describe("DailyDetailSkeleton", () => {
  it("renders a skeleton element", () => {
    const { container } = render(<DailyDetailSkeleton />)
    const skeleton = container.querySelector(".skeleton")
    expect(skeleton).toBeInTheDocument()
  })

  it("has the daily-item class", () => {
    const { container } = render(<DailyDetailSkeleton />)
    const skeleton = container.querySelector(".daily-item")
    expect(skeleton).toBeInTheDocument()
  })
})
