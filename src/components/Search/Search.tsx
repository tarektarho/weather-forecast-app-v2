import React, { useCallback, useEffect } from "react"
import { useWeather } from "../../providers/weatherContext"
import "./Search.scss"

const Search: React.FC = () => {
  const { city, setCity, searchByCity } = useWeather()

  const handleSearch = useCallback(() => {
    searchByCity()
  }, [searchByCity])

  // Defining the keydown event handler using useCallback for better performance
  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      if (event.key?.toLocaleLowerCase() === "enter") {
        handleSearch()
      }
    },
    [handleSearch],
  )

  // Attaching and detaching the event listener using useEffect
  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard)
    return () => {
      document.removeEventListener("keydown", handleKeyboard)
    }
  }, [handleKeyboard])

  return (
    <div className="search">
      <input
        data-testid="input-search-by-city"
        type="text"
        name="city"
        placeholder="Search by city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="button" data-testid="btn-search" onClick={handleSearch}>
        Search
      </button>
    </div>
  )
}

export default Search
