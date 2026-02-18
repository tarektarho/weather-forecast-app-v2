import type { FC } from "react"
import { useEffect } from "react"
import { useWeather } from "../../providers/weatherContext"
import styles from "./styles.module.scss"

/**
 * Search input component for looking up weather by city name.
 *
 * Provides a text field and search button. Supports pressing Enter to trigger
 * the search. Consumes {@link useWeather} context for city state and search action.
 *
 * @component
 */
const Search: FC = () => {
  const { city, setCity, searchByCity } = useWeather()

  const handleSearch = () => {
    searchByCity()
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.key?.toLocaleLowerCase() === "enter") {
      handleSearch()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard)
    return () => {
      document.removeEventListener("keydown", handleKeyboard)
    }
  })

  return (
    <div className={styles.search}>
      <input
        className={styles.searchInput}
        data-testid="input-search-by-city"
        type="text"
        name="city"
        placeholder="Search by city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        className={styles.searchButton}
        type="button"
        data-testid="btn-search"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  )
}

export default Search
