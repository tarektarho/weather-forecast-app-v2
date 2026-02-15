import { describe, it, expect, vi, beforeEach } from "vitest"
import type { createRoot } from "react-dom/client"

// ---------------------------------------------------------------------------
// Mocks – must be declared before the dynamic import of main.tsx
// ---------------------------------------------------------------------------

const mockRender = vi.fn()
const mockCreateRoot = vi.fn<typeof createRoot>(() => ({
  render: mockRender,
  unmount: vi.fn(),
}))

vi.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot,
}))

vi.mock("../App", () => ({ default: () => null }))
vi.mock("../styles/index.css", () => ({}))

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("main.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the module registry so main.tsx runs fresh each time
    vi.resetModules()
  })

  it("renders without crashing when #root exists", async () => {
    const root = document.createElement("div")
    root.id = "root"
    document.body.appendChild(root)

    await import("../main")

    expect(mockCreateRoot).toHaveBeenCalledWith(root)
    expect(mockRender).toHaveBeenCalledTimes(1)

    document.body.removeChild(root)
  })

  it("throws when #root element is missing", async () => {
    // Ensure no #root in the DOM
    const existing = document.getElementById("root")
    if (existing) existing.remove()

    await expect(() => import("../main")).rejects.toThrow(
      "Root element not found",
    )
  })
})
