import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, it, expect, vi } from "vitest"
import AppRoutes from "../AppRoutes"

// Mock page components to isolate route logic
vi.mock("../../pages/Dashboard/Dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}))
vi.mock("../../pages/ForecastDetail/ForecastDetail", () => ({
  default: () => <div data-testid="forecast-detail">ForecastDetail</div>,
}))

describe("AppRoutes", () => {
  it("renders Dashboard on '/' route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByTestId("dashboard")).toBeInTheDocument()
  })

  it("renders ForecastDetail on '/forecast/:dt' route", () => {
    render(
      <MemoryRouter initialEntries={["/forecast/1700000000"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByTestId("forecast-detail")).toBeInTheDocument()
  })

  it("renders nothing for an unknown route", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/unknown-path"]}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(screen.queryByTestId("dashboard")).toBeNull()
    expect(screen.queryByTestId("forecast-detail")).toBeNull()
    expect(container.innerHTML).toBe("")
  })
})
