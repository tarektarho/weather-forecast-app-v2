import type { FC } from "react"
import MapImg from "../../assets/images/map.jpeg"
import styles from "./styles.module.scss"

// Define the interface for the props received by the Modal component.
interface ModalProps {
  hideModal: () => void // Callback function to hide the modal.
}

/**
 * Welcome modal that introduces the WeatherForecastApp and lists its features.
 *
 * Shown on the user's first visit. Provides a "Continue" button to dismiss it.
 *
 * @component
 * @param props - The component props.
 * @param props.hideModal - Callback invoked to close the modal.
 */
const Modal: FC<ModalProps> = ({ hideModal }) => {
  // List of features provided by the app.
  const appFeatures = [
    "Get real-time weather with Geolocation.",
    "Search weather by city.",
    "Forecast for 5 days / 3 hours.",
    "Air Pollution from Geolocation.",
    "Share current location weather with friends.",
  ]

  return (
    <div className={styles.modalContainer} data-testid="modal-container">
      <div className={styles.modalWrapper}>
        <div className={styles.modalHeader}>
          <h2>WeatherForecastApp</h2>
          <p>Version {__APP_VERSION__}</p>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.modalBody}>
            <h3 className={styles.modalBodyTitle}>App Features</h3>
            <ul className={styles.modalFeaturesList}>
              {/* Map over the appFeatures array and display each feature as a list item. */}
              {appFeatures.map((feature, index) => (
                <li className={styles.modalFeaturesItem} key={index}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {/* Display an image of a map using the imported MapImg. */}
          <img className={styles.modalImage} src={MapImg} alt="map" />
        </div>

        <div className={styles.modalButton}>
          {/* Attach the hideModal function to the "Continue" button to close the modal. */}
          <button
            className={styles.modalContinueBtn}
            onClick={hideModal}
            data-testid="hide-modal-btn"
            aria-label="Continue to application"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
