import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import currentWidgetStyles from "../../widgets/CurrentWidget/styles.module.scss"
import shared from "../../../styles/shared.module.scss"
import skeletonStyles from "./styles.module.scss"

/**
 * Skeleton loader for the {@link CurrentWidget} component.
 *
 * Renders placeholder shapes matching the current weather widget layout.
 *
 * @component
 */
const CurrentWidgetSkeleton: FC = () => {
  return (
    <>
      <SkeletonElement
        className={`${shared.widget} ${currentWidgetStyles.weatherDetail}`}
        role="current-widget-skeleton"
      />
      <div className={shared.weatherExtraWrapper}>
        <SkeletonElement
          className={`${shared.widget} ${skeletonStyles.weatherExtraSm}`}
        />
        <SkeletonElement
          className={`${shared.widget} ${skeletonStyles.weatherExtraSm}`}
        />
        <SkeletonElement
          className={`${shared.widget} ${skeletonStyles.weatherExtraSm}`}
        />
      </div>
    </>
  )
}

export default CurrentWidgetSkeleton
