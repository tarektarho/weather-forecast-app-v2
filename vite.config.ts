import { defineConfig } from "vitest/config"
import type { Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { ViteImageOptimizer } from "vite-plugin-image-optimizer"

/**
 * Inlines all emitted CSS into a `<style>` tag in index.html and removes the
 * standalone CSS asset. This eliminates the CSS file from the critical request
 * chain so the browser only needs HTML → JS (no extra CSS round-trip).
 */
function inlineCssPlugin(): Plugin {
  return {
    name: "vite-plugin-inline-css",
    enforce: "post",
    apply: "build",
    generateBundle(_, bundle) {
      const cssFileNames: string[] = []
      let cssSource = ""

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === "asset" && fileName.endsWith(".css")) {
          cssSource +=
            typeof chunk.source === "string"
              ? chunk.source
              : chunk.source.toString()
          cssFileNames.push(fileName)
        }
      }

      if (!cssSource) return

      for (const chunk of Object.values(bundle)) {
        if (
          chunk.type === "asset" &&
          typeof chunk.fileName === "string" &&
          chunk.fileName.endsWith(".html")
        ) {
          let html =
            typeof chunk.source === "string"
              ? chunk.source
              : chunk.source.toString()
          // Remove <link rel="stylesheet" …> tags
          html = html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>\s*/g, "")
          // Inject inlined CSS before </head>
          html = html.replace("</head>", `<style>${cssSource}</style>\n</head>`)
          chunk.source = html
        }
      }

      // Delete the standalone CSS files from the output
      for (const name of cssFileNames) {
        delete bundle[name]
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/weather-forecast-app-v2/",
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "2.0.0"),
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", {}]],
      },
    }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 75 },
      webp: { quality: 80 },
    }),
    inlineCssPlugin(),
  ],
  server: {
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          redux: ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
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
