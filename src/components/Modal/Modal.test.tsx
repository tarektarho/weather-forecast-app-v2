import { render, screen, fireEvent } from "@testing-library/react"
import Modal from "./Modal"

describe("Modal", () => {
  const hideModalMock = vi.fn()

  beforeEach(() => {
    hideModalMock.mockClear()
  })

  it("renders the modal with correct title and version", () => {
    render(<Modal hideModal={hideModalMock} />)

    expect(screen.getByText("WeatherForecastApp")).toBeVisible()
    expect(screen.getByTestId("modal-container")).toBeVisible()
  })

  it("renders all app features", () => {
    render(<Modal hideModal={hideModalMock} />)

    expect(
      screen.getByText("Get real-time weather with Geolocation."),
    ).toBeVisible()
    expect(screen.getByText("Search weather by city.")).toBeVisible()
    expect(screen.getByText("Forecast for 5 days / 3 hours.")).toBeVisible()
    expect(screen.getByText("Air Pollution from Geolocation.")).toBeVisible()
    expect(
      screen.getByText("Share current location weather with friends."),
    ).toBeVisible()
  })

  it("renders the map image", () => {
    render(<Modal hideModal={hideModalMock} />)

    const img = screen.getByAltText("map")
    expect(img).toBeVisible()
  })

  it("renders the continue button", () => {
    render(<Modal hideModal={hideModalMock} />)

    const button = screen.getByTestId("hide-modal-btn")
    expect(button).toBeVisible()
    expect(button.textContent).toBe("Continue")
  })

  it("calls hideModal when continue button is clicked", () => {
    render(<Modal hideModal={hideModalMock} />)

    const button = screen.getByTestId("hide-modal-btn")
    fireEvent.click(button)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })
})
