import type { FC } from "react"
import Dashboard from "./pages/Dashboard/Dashboard"
import { WeatherProvider } from "./providers/weatherProvider"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"

/**
 * Root application component.
 *
 * Wraps the entire app in an {@link ErrorBoundary} for graceful error handling
 * and a {@link WeatherProvider} that supplies weather data via React context.
 *
 * @component
 */
const App: FC = () => {
  return (
    <ErrorBoundary>
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    </ErrorBoundary>
  )
}

export default App
