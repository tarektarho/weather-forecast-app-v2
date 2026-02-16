import type { ReactNode, ErrorInfo } from "react"
import { Component } from "react"
import styles from "./styles.module.scss"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary component using React 19's enhanced error handling
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error("Error Boundary caught an error:", error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    // Reload the page to reset the app state
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Oops! Something went wrong</h1>
            <p className={styles.message}>
              We're sorry, but something unexpected happened. Please try again.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className={styles.details}>
                <summary className={styles.summary}>Error Details</summary>
                <pre className={styles.errorText}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button onClick={this.handleReset} className={styles.button}>
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
