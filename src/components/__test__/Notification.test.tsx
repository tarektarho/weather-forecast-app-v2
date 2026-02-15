import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Notification from "../Notification"

// Stub image imports
vi.mock("../../assets/images/error.png", () => ({ default: "error.png" }))
vi.mock("../../assets/images/close.png", () => ({ default: "close.png" }))

describe("Notification", () => {
  it("renders error notification with error icon", () => {
    render(
      <Notification
        message="city not found"
        hideNotification={() => {}}
        type="error"
      />,
    )
    const div = screen.getByTestId("notification")
    const icon = screen.getByTestId("error-icon")

    expect(div).toBeVisible()
    expect(div).toHaveClass("error")
    expect(div.textContent?.trim()).toContain("city not found")
    expect(icon).toBeVisible()
  })

  it("renders info notification without error icon", () => {
    render(
      <Notification
        message="URL was copied to clipboard"
        hideNotification={() => {}}
        type="info"
      />,
    )

    const div = screen.getByTestId("notification")

    expect(div).toBeVisible()
    expect(div).toHaveClass("info")
    expect(div.textContent?.trim()).toContain("URL was copied to clipboard")
    expect(screen.queryByTestId("error-icon")).toBeNull()
  })

  it("renders success notification without error icon", () => {
    render(
      <Notification
        message="Operation completed"
        hideNotification={() => {}}
        type="success"
      />,
    )

    const div = screen.getByTestId("notification")

    expect(div).toBeVisible()
    expect(div).toHaveClass("success")
    expect(div.textContent?.trim()).toContain("Operation completed")
    expect(screen.queryByTestId("error-icon")).toBeNull()
  })

  it("calls hideNotification when close icon is clicked", () => {
    const hideNotification = vi.fn()
    render(
      <Notification
        message="some message"
        hideNotification={hideNotification}
        type="error"
      />,
    )

    fireEvent.click(screen.getByTestId("close-icon"))
    expect(hideNotification).toHaveBeenCalledTimes(1)
  })

  it("displays the message text", () => {
    render(
      <Notification
        message="Test message"
        hideNotification={() => {}}
        type="info"
      />,
    )
    expect(screen.getByText("Test message")).toBeInTheDocument()
  })

  it("renders correctly with undefined message", () => {
    render(
      <Notification
        message={undefined}
        hideNotification={() => {}}
        type="info"
      />,
    )
    const div = screen.getByTestId("notification")
    expect(div).toBeVisible()
    expect(div).toHaveClass("info")
    expect(screen.queryByTestId("error-icon")).toBeNull()
  })
})
