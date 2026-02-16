import React from "react"
import SkeletonElement from "./SkeletonElement"
import skeletonStyles from "./styles.module.scss"
import airPollutionStyles from "../../widgets/AirPollutionWidget/styles.module.scss"

const AirPollutionWidgetSkeleton: React.FC = () => {
  return (
    <>
      <div className={`${airPollutionStyles.airTitle} mb-8`}>
        <SkeletonElement className={skeletonStyles.longTitle} />
        <SkeletonElement className={skeletonStyles.title} />
      </div>
      <div className="flex-wrap">
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
