/**
 * Get a URL parameter's value from the current page URL.
 * @param param - URL parameter name.
 * @returns The parameter's value or null if not found.
 */
export const getURLParam = (param: string): string | null => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get(param)
}
