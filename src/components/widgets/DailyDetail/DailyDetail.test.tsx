import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import DailyDetail from "./DailyDetail"
import type { ForecastItem } from "../../../types/forecast"

describe("DailyDetail", () => {
  const description = "My description"

  const dataMock: ForecastItem = {
    dt: 1666048008,
    clouds: { all: 0 },
    main: {
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
      sea_level: 0,
      grnd_level: 0,
      humidity: 0,
      temp_kf: 0,
    },
    weather: [{ icon: "icon", description, main: "", id: 0 }],
    wind: { speed: 0, deg: 0, gust: 0 },
    visibility: 0,
    pop: 0,
    sys: { pod: "" },
    dt_txt: "",
  }

  it("renders with data", () => {
    render(
      <MemoryRouter>
        <DailyDetail data={dataMock} />
      </MemoryRouter>,
    )

    const link = screen.getByTestId("daily-item")
    expect(link).toBeVisible()
    expect(link).toHaveAttribute("href", "/forecast/1666048008")

    const pDescription = screen.getByTestId("daily-description")
    expect(pDescription).toBeVisible()
    expect(pDescription.textContent).toEqual(description)
  })

  it("renders null if no data is passed to the component in the props", () => {
    const { container } = render(
      <MemoryRouter>
        <DailyDetail data={null} />
      </MemoryRouter>,
    )
    expect(container.innerHTML).toBe("")
  })
})
