/**
 * Set an item in local storage.
 * @param name - Name of the local storage item.
 * @param value - Value to be stored.
 */
export const setLocalStorageItem = (name: string, value: unknown): void => {
  localStorage.setItem(name, JSON.stringify(value))
}

/**
 * Get an item from local storage.
 * @param name - Name of the local storage item.
 * @returns The stored value or null if not found.
 */
export const getLocalStorageItem = (name: string): unknown => {
  const data = localStorage.getItem(name)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      // Corrupted or non-JSON value — remove it and fall through
      localStorage.removeItem(name)
      return null
    }
  }
  return null
}
