import type { FC, ReactNode } from "react"
import shared from "../../../styles/shared.module.scss"
import styles from "./styles.module.scss"

interface WidgetContainerProps {
  /** Content rendered inside the container. */
  children: ReactNode
  /** Apply flex-item behaviour (used when the container lives inside a flex parent). */
  flexItem?: boolean
  /** Additional CSS class(es) to merge in. */
  className?: string
}

/**
 * Reusable wrapper that applies the base widget styling (border-radius,
 * box-shadow, padding) with scoped CSS modules.
 *
 * Set `flexItem` to true when the container is a direct child of a flex
 * layout so it stretches to fill available space.
 *
 * @component
 * @example
 * <WidgetContainer flexItem>
 *   <AdditionalWidget />
 * </WidgetContainer>
 */
const WidgetContainer: FC<WidgetContainerProps> = ({
  children,
  flexItem = false,
  className,
}) => {
  const classes = [
    shared.widget,
    flexItem ? styles.flexItem : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return <div className={classes}>{children}</div>
}

export default WidgetContainer
