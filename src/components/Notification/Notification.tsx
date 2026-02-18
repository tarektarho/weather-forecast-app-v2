import type { FC } from "react"
import ErrorIcon from "../../assets/images/error.png"
import CloseIcon from "../../assets/images/close.png"
import styles from "./styles.module.scss"

// Define the interface for the props received by the Notification component.
interface NotificationProps {
  message: string | undefined // Message to display in the notification.
  hideNotification: () => void // Callback function to hide the notification.
  type: "error" | "info" | "success" // Type of notification (error, info, or success).
}

/**
 * Displays a dismissible notification banner with an optional icon.
 *
 * Supports "error", "info", and "success" notification types.
 * Error notifications include a dedicated error icon.
 *
 * @component
 * @param props - The component props.
 * @param props.message - Text content of the notification.
 * @param props.hideNotification - Callback invoked to dismiss the notification.
 * @param props.type - Visual style variant: `"error"` | `"info"` | `"success"`.
 */
const Notification: FC<NotificationProps> = ({
  message,
  hideNotification,
  type,
}) => {
  // Function to render the appropriate icon based on the notification type.
  const renderIcon = () => {
    if (type === "error") {
      return (
        <img
          className={styles.notificationIcon}
          src={ErrorIcon}
          alt={type}
          width={16}
          height={16}
          data-testid="error-icon"
        />
      )
    }
    // If the type is not "error", no icon is rendered.
    return
  }

  return (
    <div
      className={`${styles.notification} ${styles[type]}`}
      data-testid="notification"
    >
      <div className={styles.notificationMessage}>
        {/* Call the renderIcon function to display the appropriate icon. */}
        {renderIcon()}
        <p>{message}</p> {/* Display the notification message. */}
      </div>
      <div
        onClick={hideNotification}
        data-testid="close-icon"
        role="button"
        aria-label="Close notification"
      >
        <img
          className={styles.closeIcon}
          src={CloseIcon}
          alt="closeIcon"
          width={16}
          height={16}
        />{" "}
        {/* Display the close icon. */}
      </div>
    </div>
  )
}

export default Notification
