import React from "react"
import SkeletonElement from "./SkeletonElement"
import searchStyles from "../../Search/styles.module.scss"
import skeletonStyles from "./styles.module.scss"

const SearchSkeleton: React.FC = () => {
  return (
    <div className={searchStyles.search}>
      <SkeletonElement className={skeletonStyles.input} role="search" />
      <SkeletonElement className={skeletonStyles.button} role="button" />
    </div>
  )
}

export default SearchSkeleton
