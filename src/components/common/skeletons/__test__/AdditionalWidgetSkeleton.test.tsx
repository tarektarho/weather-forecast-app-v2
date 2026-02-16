import { render, screen } from "@testing-library/react"
import AdditionalWidgetSkeleton from "../AdditionalWidgetSkeleton"
import skeletonStyles from "../styles.module.scss"

describe("AdditionalWidgetSkeleton", () => {
  it("renders the AdditionalWidgetSkeleton component with the correct structure", () => {
    render(<AdditionalWidgetSkeleton />)

    // Verify that the component contains elements with skeleton classes
    const skeletons = screen.getAllByTestId("skeleton-test-id")
    expect(skeletons[0]).toHaveClass(skeletonStyles.skeleton)

    // Verify the structure of the component
    const title = skeletons[0]
    const weatherExtra = skeletons[1]

    expect(title).toBeInTheDocument()
    expect(weatherExtra).toBeInTheDocument()
  })
})
