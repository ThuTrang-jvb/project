import React, { useState } from "react"
import { Play, Plus, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getImageUrl, formatDate } from "../config/api"
import type { MovieCardProps } from "../types/movie"
import "./MovieCard.css"

const MovieCard = ({ movie }: MovieCardProps): React.ReactElement => {
  const [isHovered, setIsHovered] = useState<boolean>(false)
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
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="poster-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-4c38c8f20c3a2a2524cba6be144df78e13bc4c98a497f78f9345025c8f93b68b.svg"
          }}
        />

        <div className="movie-overlay">
          <button className="action-btn play-btn" onClick={(e) => e.stopPropagation()}>
            <Play size={16} fill="currentColor" />
          </button>
          <button className="action-btn add-btn" onClick={(e) => e.stopPropagation()}>
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="year">{movie.release_date}</p>
        <p className="rating">
          <Star size={12} fill="currentColor" />
          {movie.vote_average.toFixed(2)}
        </p>
        
      </div>
    </div>
  )
}

export default MovieCard