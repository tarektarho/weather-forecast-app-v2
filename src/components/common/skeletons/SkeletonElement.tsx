import React from "react"
import styles from "./styles.module.scss"

interface SkeletonProps {
  className?: string
  role?: string
}

const SkeletonElement: React.FC<SkeletonProps> = ({ className, role }) => {
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
