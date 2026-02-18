import { sleep } from "../sleep"

describe("utils/sleep", () => {
  describe("sleep", () => {
    it("resolves after the specified delay", async () => {
      vi.useFakeTimers()

      let resolved = false
      sleep(500).then(() => {
        resolved = true
      })

      expect(resolved).toBe(false)

      await vi.advanceTimersByTimeAsync(499)
      expect(resolved).toBe(false)

      await vi.advanceTimersByTimeAsync(1)
      expect(resolved).toBe(true)

      vi.useRealTimers()
    })
  })
})
