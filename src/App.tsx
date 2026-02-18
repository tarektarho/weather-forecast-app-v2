import type { FC } from "react"
import Dashboard from "./pages/Dashboard/Dashboard"
import { WeatherProvider } from "./providers/weatherProvider"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"

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
