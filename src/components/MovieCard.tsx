import React, { useState } from "react"
import { Play, Heart, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getImageUrl } from "../config/api"
import type { MovieCardProps } from "../types/movie"   
import TrailerModal from "./TrailerModal"
import { useFavorites } from "../context/FavoritesContext"
import "./MovieCard.css"

const MovieCard: React.FC<MovieCardProps> = ({ movie, type = "movie" }) => {
  const navigate = useNavigate()
  const [showTrailer, setShowTrailer] = useState(false)

  const { favorites, toggleFavorite } = useFavorites()
  const isFavorite = favorites.includes(movie.id)

  const handleCardClick = () => {
    navigate(`/${type}/${movie.id}`)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowTrailer(true)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(movie.id)
  }

  return (
    <>
      <div className="movie-card" onClick={handleCardClick}>
        <div className="movie-poster">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="poster-image"
          />
          <div className="movie-overlay">
            <button className="action-btn play-btn" onClick={handlePlayClick}>
              <Play size={20} fill="currentColor" />
            </button>
            <button
              className={`action-btn add-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavoriteClick}
            >
              <Heart size={20} fill={isFavorite ? "red" : "none"} />
            </button>
          </div>
        </div>

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-date">{movie.release_date}</p>
          <p className="movie-rating">
            <Star size={12} fill="currentColor" />{" "}
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal
          id={movie.id}
          type={type}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  )
}

export default MovieCard
