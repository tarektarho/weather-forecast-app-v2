import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import shared from "../../../styles/shared.module.scss"
import skeletonStyles from "./styles.module.scss"
import airPollutionStyles from "../../widgets/AirPollutionWidget/styles.module.scss"

/**
 * Skeleton loader for the {@link AirPollutionWidget} component.
 *
 * Renders placeholder shapes matching the air pollution widget layout.
 *
 * @component
 */
const AirPollutionWidgetSkeleton: FC = () => {
  return (
    <>
      <div className={`${airPollutionStyles.airTitle} ${shared.mb8}`}>
        <SkeletonElement className={skeletonStyles.longTitle} />
        <SkeletonElement className={skeletonStyles.title} />
      </div>
      <div className={shared.flexWrap}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <div
            className={`${skeletonStyles.skeleton} ${airPollutionStyles.airData}`}
            key={index}
            data-skeleton
          ></div>
        ))}
      </div>
    </>
  )
}

export default AirPollutionWidgetSkeleton
