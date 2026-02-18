import type { FC } from "react"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { WeatherProvider } from "./providers/weatherProvider"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"

/**
 * Root application component.
 *
 * Wraps the entire app in an {@link ErrorBoundary} for graceful error handling,
 * a {@link BrowserRouter} for client-side routing, and a {@link WeatherProvider}
 * that supplies weather data via React context.
 *
 * @component
 */
const App: FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/weather-forecast-app-v2">
        <WeatherProvider>
          <AppRoutes />
        </WeatherProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
