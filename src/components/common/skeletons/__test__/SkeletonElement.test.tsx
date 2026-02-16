import { render, screen } from "@testing-library/react"
import SkeletonElement from "../SkeletonElement"
import styles from "../styles.module.scss"

describe("SkeletonElement", () => {
  it("renders a skeleton element with className and role", () => {
    render(<SkeletonElement className={styles.input} role="text" />)

    const skeletonElement = screen.getByTestId("skeleton-test-id")
    expect(skeletonElement).toHaveClass(styles.skeleton)
    expect(skeletonElement).toHaveClass(styles.input)
    expect(skeletonElement).toHaveAttribute("role", "text")
  })

  it("renders a skeleton element with only the base class when no className is provided", () => {
    render(<SkeletonElement />)

    const skeletonElement = screen.getByTestId("skeleton-test-id")
    expect(skeletonElement).toHaveClass(styles.skeleton)
    expect(skeletonElement).not.toHaveAttribute("role")
  })
})
