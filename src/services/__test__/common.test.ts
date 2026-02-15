import { fetchData } from "../common"

describe("fetchData", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("returns parsed JSON data on successful response (200)", async () => {
    const mockData = { name: "Test City", temp: 293 }
    fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 })

    const result = await fetchData("https://api.example.com", "q=test")
    expect(result).toEqual(mockData)
  })

  it("throws parsed response data when status is not 200", async () => {
    const errorData = { cod: "404", message: "city not found" }
    fetchMock.mockResponseOnce(JSON.stringify(errorData), { status: 404 })

    await expect(
      fetchData("https://api.example.com", "q=invalid"),
    ).rejects.toEqual(errorData)
  })

  it("throws parsed response data for 500 server error", async () => {
    const errorData = { cod: 500, message: "internal server error" }
    fetchMock.mockResponseOnce(JSON.stringify(errorData), { status: 500 })

    await expect(
      fetchData("https://api.example.com", "q=test"),
    ).rejects.toEqual(errorData)
  })
})
