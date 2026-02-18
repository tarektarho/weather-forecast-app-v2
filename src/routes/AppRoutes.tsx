import type { FC } from "react"
import { Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard/Dashboard"
import ForecastDetail from "../pages/ForecastDetail/ForecastDetail"

/**
 * Centralised route definitions for the application.
 *
 * Keeps all `<Route>` declarations in a single file so that App.tsx
 * remains focused on global providers and layout wrappers.
 *
 * @component
 */
const AppRoutes: FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/forecast/:dt" element={<ForecastDetail />} />
  </Routes>
)

export default AppRoutes
