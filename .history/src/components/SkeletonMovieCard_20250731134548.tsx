import React from "react"
import "./SkeletonMovieCard.css"

const SkeletonMovieCard = (): React.ReactElement => {
  return (
    <div className="movie-card skeleton-card">
      <div className="poster-skeleton shimmer" />
      <div className="text-line shimmer" />
      <div className="text-line short shimmer" />
    </div>
  )
}

export default SkeletonMovieCard
