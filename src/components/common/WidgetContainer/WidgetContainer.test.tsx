import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import WidgetContainer from "./WidgetContainer"

describe("WidgetContainer", () => {
  it("renders children", () => {
    render(
      <WidgetContainer>
        <p>Hello</p>
      </WidgetContainer>,
    )
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })

  it("applies the widget class by default", () => {
    const { container } = render(
      <WidgetContainer>
        <span>Content</span>
      </WidgetContainer>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain("widget")
  })

  it("applies flexItem class when prop is true", () => {
    const { container } = render(
      <WidgetContainer flexItem>
        <span>Content</span>
      </WidgetContainer>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain("flexItem")
  })

  it("does not apply flexItem class by default", () => {
    const { container } = render(
      <WidgetContainer>
        <span>Content</span>
      </WidgetContainer>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).not.toContain("flexItem")
  })

  it("merges additional className", () => {
    const { container } = render(
      <WidgetContainer className="custom-class">
        <span>Content</span>
      </WidgetContainer>,
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain("custom-class")
  })
})
