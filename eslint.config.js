import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import react from "eslint-plugin-react"
import prettier from "eslint-plugin-prettier"
import testingLibrary from "eslint-plugin-testing-library"

// Shared rules used across source and test configurations
const sharedRules = {
  ...js.configs.recommended.rules,
  "no-unused-vars": "off",
  "prettier/prettier": "error",
  "react/jsx-no-target-blank": "off",
  "react/react-in-jsx-scope": "off",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  "@typescript-eslint/no-non-null-assertion": "warn",
  "@typescript-eslint/consistent-type-imports": "warn",
}

// Shared parser options for TypeScript files
const sharedParserOptions = {
  ecmaVersion: "latest",
  parser: tsParser,
  parserOptions: {
    ecmaFeatures: { jsx: true },
    sourceType: "module",
    project: "./tsconfig.json",
  },
}

// Shared React settings
const sharedSettings = {
  react: { version: "detect" },
}

// Shared plugins used across configurations
const sharedPlugins = {
  react,
  "react-hooks": reactHooks,
  "@typescript-eslint": tseslint,
  prettier,
}

export default [
  {
    ignores: ["dist", "build", "node_modules", "coverage/**"],
  },
  // Configuration for source files
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/**/*.test.{ts,tsx}",
      "src/**/__test__/**",
      "src/**/__tests__/**",
    ],
    languageOptions: {
      ...sharedParserOptions,
      globals: globals.browser,
    },
    plugins: {
      ...sharedPlugins,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...sharedRules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    settings: sharedSettings,
  },
  // Configuration for test files
  {
    files: [
      "src/**/*.test.{ts,tsx}",
      "src/**/__test__/**/*.{ts,tsx}",
      "src/**/__tests__/**/*.{ts,tsx}",
    ],
    languageOptions: {
      ...sharedParserOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
        fetchMock: "readonly",
      },
    },
    plugins: {
      ...sharedPlugins,
      "testing-library": testingLibrary,
    },
    rules: {
      ...sharedRules,
      ...reactHooks.configs.recommended.rules,
      "testing-library/await-async-queries": "error",
      "testing-library/await-async-utils": "error",
      "testing-library/no-await-sync-queries": "error",
      "testing-library/no-container": "warn",
      "testing-library/no-debugging-utils": "warn",
      "testing-library/no-dom-import": ["error", "react"],
      "testing-library/no-promise-in-fire-event": "error",
      "testing-library/no-wait-for-multiple-assertions": "warn",
      "testing-library/no-wait-for-side-effects": "warn",
      "testing-library/prefer-find-by": "warn",
      "testing-library/prefer-presence-queries": "warn",
      "testing-library/prefer-screen-queries": "warn",
      "no-undef": "off", // vitest globals handled via globals.vitest
    },
    settings: sharedSettings,
  },
  // Configuration for config files (without TypeScript project checking)
  {
    files: ["*.config.{ts,js}", "*.config.*.{ts,js}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]
