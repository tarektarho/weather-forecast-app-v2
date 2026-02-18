/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string
  // more env variables...
}
