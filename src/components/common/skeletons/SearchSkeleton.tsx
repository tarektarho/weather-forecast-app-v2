import type { FC } from "react"
import SkeletonElement from "./SkeletonElement"
import searchStyles from "../../Search/styles.module.scss"
import skeletonStyles from "./styles.module.scss"

/**
 * Skeleton loader for the {@link Search} component.
 *
 * Renders placeholder shapes for the search input and button.
 *
 * @component
 */
const SearchSkeleton: FC = () => {
  return (
    <div className={searchStyles.search}>
      <SkeletonElement className={skeletonStyles.input} role="search" />
      <SkeletonElement className={skeletonStyles.button} role="button" />
    </div>
  )
}

export default SearchSkeleton
