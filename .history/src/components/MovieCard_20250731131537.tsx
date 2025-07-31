import React, { useState } from "react"
import { Play, Plus, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getImageUrl, formatDate } from "../config/api"
import type { MovieCardProps } from "../types/movie"
import "./MovieCard.css"

const MovieCard = ({ movie }: MovieCardProps): React.ReactElement => {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = (): void => {
    navigate(`/movie/${movie.id}`)
  }

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="movie-poster">
        <img
          src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
          alt={movie.title}
          className="poster-image"
          loading="lazy" // ✅ Chỉ tải ảnh khi cần
        />

        <div className={`movie-overlay ${isHovered ? "visible" : ""}`}>
          <div className="movie-actions">
            <button
              className="action-btn play-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <Play size={16} fill="currentColor" />
            </button>
            <button
              className="action-btn add-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <div className="movie-meta">
              <span className="rating">
                <Star size={12} fill="currentColor" />
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="year">{formatDate(movie.release_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
