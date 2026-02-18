/**
 * Write text to the system clipboard.
 * @param text - The text to copy.
 * @returns A promise that resolves when copying is successful.
 */
export const writeToClipboard = (text: string): Promise<void> => {
  return navigator.clipboard.writeText(text)
}
