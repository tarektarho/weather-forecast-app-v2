import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import shared from "../../../styles/shared.module.scss"
import dailyDetailStyles from "../../widgets/DailyDetail/styles.module.scss"

/**
 * Skeleton loader for a single {@link DailyDetail} forecast item.
 *
 * @component
 */
const DailyDetailSkeleton: FC = () => {
  return (
    <SkeletonElement
      className={`${shared.widget} ${dailyDetailStyles.dailyItem}`}
    />
  )
}

export default DailyDetailSkeleton
