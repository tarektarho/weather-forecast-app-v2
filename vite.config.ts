import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/weather-forecast-app-v2/",
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
  ],
  server: {
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
    coverage: {
      provider: "v8",
      exclude: [
        "node_modules/**",
        "build/**",
        "dist/**",
        "src/setupTests.ts",
        "src/vite-env.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,js}",
        "**/*.d.ts",
        "**/testUtils.ts",
        "src/types/**",
        "src/store/types.ts",
      ],
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
    },
  },
})
