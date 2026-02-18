import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import dailyDetailStyles from "../../widgets/DailyDetail/styles.module.scss"

/**
 * Skeleton loader for a single {@link DailyDetail} forecast item.
 *
 * @component
 */
const DailyDetailSkeleton: FC = () => {
  return <SkeletonElement className={`widget ${dailyDetailStyles.dailyItem}`} />
}

export default DailyDetailSkeleton
