import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import currentWidgetStyles from "../../widgets/CurrentWidget/styles.module.scss"
import skeletonStyles from "./styles.module.scss"

const CurrentWidgetSkeleton: FC = () => {
  return (
    <>
      <SkeletonElement
        className={`widget ${currentWidgetStyles.weatherDetail}`}
        role="current-widget-skeleton"
      />
      <div className="weather-extra-wrapper">
        <SkeletonElement
          className={`widget ${skeletonStyles.weatherExtraSm}`}
        />
        <SkeletonElement
          className={`widget ${skeletonStyles.weatherExtraSm}`}
        />
        <SkeletonElement
          className={`widget ${skeletonStyles.weatherExtraSm}`}
        />
      </div>
    </>
  )
}

export default CurrentWidgetSkeleton
