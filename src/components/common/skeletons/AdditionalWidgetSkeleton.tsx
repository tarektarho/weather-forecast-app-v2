import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import additionalStyles from "../../widgets/AdditionalWidget/styles.module.scss"
import shared from "../../../styles/shared.module.scss"
import skeletonStyles from "./styles.module.scss"

/**
 * Skeleton loader for the {@link AdditionalWidget} component.
 *
 * Renders placeholder shapes matching the sunrise/sunset widget layout.
 *
 * @component
 */
const AdditionalWidgetSkeleton: FC = () => {
  return (
    <div
      className={`${shared.weatherExtraWrapper} ${additionalStyles.myOtherStep}`}
    >
      {/* Widget title */}
      <SkeletonElement className={skeletonStyles.longTitle} />
      <div className={shared.extraInfoContainer}>
        {/* Sunrise information */}
        <SkeletonElement
          className={`${shared.widget} ${skeletonStyles.weatherExtraLg}`}
        />
        {/* Sunset information */}
        <SkeletonElement
          className={`${shared.widget} ${skeletonStyles.weatherExtraLg} ${shared.mb0}`}
        />
      </div>
    </div>
  )
}

export default AdditionalWidgetSkeleton
