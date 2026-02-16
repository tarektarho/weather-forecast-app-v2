import React from "react"
import SkeletonElement from "./SkeletonElement"
import additionalStyles from "../../widgets/AdditionalWidget/styles.module.scss"
import skeletonStyles from "./styles.module.scss"

const AdditionalWidgetSkeleton: React.FC = () => {
  return (
    <div className={`weather-extra-wrapper ${additionalStyles.myOtherStep}`}>
      {/* Widget title */}
      <SkeletonElement className={skeletonStyles.longTitle} />
      <div className="extra-info-container">
        {/* Sunrise information */}
        <SkeletonElement
          className={`widget ${skeletonStyles.weatherExtraLg}`}
        />
        {/* Sunset information */}
        <SkeletonElement
          className={`widget ${skeletonStyles.weatherExtraLg} mb-0`}
        />
      </div>
    </div>
  )
}

export default AdditionalWidgetSkeleton
