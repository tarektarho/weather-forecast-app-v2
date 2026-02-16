import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import DailyDetailSkeleton from "../DailyDetailSkeleton"
import dailyDetailStyles from "../../../widgets/DailyDetail/styles.module.scss"

describe("DailyDetailSkeleton", () => {
  it("renders a skeleton element", () => {
    render(<DailyDetailSkeleton />)
    expect(screen.getByTestId("skeleton-test-id")).toBeInTheDocument()
  })

  it("has the daily-item class", () => {
    render(<DailyDetailSkeleton />)
    const skeleton = screen.getByTestId("skeleton-test-id")
    expect(skeleton).toHaveClass(dailyDetailStyles.dailyItem)
  })
})
