import type { FC } from "react"
import styles from "./styles.module.scss"

interface SkeletonProps {
  className?: string
  role?: string
}

/**
 * Generic skeleton placeholder element used to indicate loading state.
 *
 * Renders an animated placeholder `<div>` styled via CSS modules.
 *
 * @component
 * @param props - The component props.
 * @param props.className - Additional CSS class(es) to control size and shape.
 * @param props.role - Optional ARIA role for accessibility.
 */
const SkeletonElement: FC<SkeletonProps> = ({ className, role }) => {
  const classes = `${styles.skeleton} ${className || ""}`.trim()

  return (
    <div
      data-testid="skeleton-test-id"
      data-skeleton
      className={classes}
      role={role}
    ></div>
  )
}

export default SkeletonElement
