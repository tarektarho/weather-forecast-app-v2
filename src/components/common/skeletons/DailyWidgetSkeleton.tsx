import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import DailyDetailSkeleton from "./DailyDetailSkeleton"
import dailyWidgetStyles from "../../widgets/DailyWidget/styles.module.scss"
import skeletonStyles from "./styles.module.scss"

/**
 * Skeleton loader for the {@link DailyWidget} component.
 *
 * Renders a title placeholder and multiple {@link DailyDetailSkeleton} items
 * to match the 5-day forecast widget layout.
 *
 * @component
 */
const DailyWidgetSkeleton: FC = () => {
  return (
    <>
      <SkeletonElement
        className={skeletonStyles.forecastTitle}
        role="daily-widget-skeleton"
      />
      <div className={dailyWidgetStyles.dailyContainer}>
        <div className={dailyWidgetStyles.dailyWrapper}>
          {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
            <DailyDetailSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  )
}

export default DailyWidgetSkeleton
