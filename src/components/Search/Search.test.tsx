import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Search from "./Search"

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSetCity = vi.fn()
const mockSearchByCity = vi.fn()
const mockUseWeather = vi.fn()

vi.mock("../../providers/weatherContext", () => ({
  useWeather: () => mockUseWeather(),
}))

function defaultContext(cityOverride = "") {
  return {
    city: cityOverride,
    setCity: mockSetCity,
    searchByCity: mockSearchByCity,
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Search", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseWeather.mockReturnValue(defaultContext())
  })

  it("renders search input and button", () => {
    render(<Search />)
    expect(screen.getByTestId("input-search-by-city")).toBeVisible()
    expect(screen.getByTestId("btn-search")).toBeVisible()
  })

  it("renders the placeholder text", () => {
    render(<Search />)
    expect(screen.getByPlaceholderText("Search by city...")).toBeInTheDocument()
  })

  it("calls setCity on input change", () => {
    render(<Search />)
    const input = screen.getByTestId("input-search-by-city")
    fireEvent.change(input, { target: { value: "Amsterdam" } })
    expect(mockSetCity).toHaveBeenCalledWith("Amsterdam")
  })

  it("displays the city value from context", () => {
    mockUseWeather.mockReturnValue(defaultContext("Berlin"))
    render(<Search />)
    const input = screen.getByTestId("input-search-by-city") as HTMLInputElement
    expect(input.value).toBe("Berlin")
  })

  it("calls searchByCity on button click", () => {
    render(<Search />)
    fireEvent.click(screen.getByTestId("btn-search"))
    expect(mockSearchByCity).toHaveBeenCalledTimes(1)
  })

  it("calls searchByCity on Enter key press", () => {
    render(<Search />)
    fireEvent.keyDown(document, { key: "Enter" })
    expect(mockSearchByCity).toHaveBeenCalledTimes(1)
  })

  it("does not call searchByCity on non-Enter key press", () => {
    render(<Search />)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(mockSearchByCity).not.toHaveBeenCalled()
  })

  it("calls searchByCity on enter key (lowercase)", () => {
    render(<Search />)
    fireEvent.keyDown(document, { key: "enter" })
    expect(mockSearchByCity).toHaveBeenCalledTimes(1)
  })

  it("removes keydown listener on unmount", () => {
    const { unmount } = render(<Search />)
    unmount()

    fireEvent.keyDown(document, { key: "Enter" })
    expect(mockSearchByCity).not.toHaveBeenCalled()
  })

  it("handles keydown event with undefined key gracefully", () => {
    render(<Search />)
    fireEvent.keyDown(document, {})
    expect(mockSearchByCity).not.toHaveBeenCalled()
  })
})
