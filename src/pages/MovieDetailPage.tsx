import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Play, Heart, Star, Clock, Calendar } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate, formatRuntime } from "../config/api"
import type { MovieDetails, Cast, Movie } from "../types/movie"
import TrailerModal from "../components/TrailerModal"
import { useFavorites } from "../context/FavoritesContext"  
import MovieCard from "../components/MovieCard"
import "./MovieDetail.css"

const MovieDetail = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [cast, setCast] = useState<Cast[]>([])
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showTrailer, setShowTrailer] = useState(false)
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorite = movie ? favorites.includes(movie.id) : false

  useEffect(() => {
    const fetchMovieData = async (): Promise<void> => {
      if (!id) return

      try {
        const movieId = Number.parseInt(id)
        const [movieDetails, movieCast, similar] = await Promise.all([
          movieService.getMovieDetails(movieId),
          movieService.getMovieCast(movieId),
          movieService.getSimilarMovies(movieId),
        ])

        setMovie(movieDetails)
        setCast(movieCast.slice(0, 5))
        setSimilarMovies(similar.slice(0, 8))
      } catch (error) {
        console.error("Error fetching movie details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData()
  }, [id])

  if (loading) {
    return (
      <div className="movie-detail">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="movie-detail">
        <div className="error-container">
          <h2>Movie not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-detail">
      <div className="movie-hero">
        <div className="movie-backdrop">
          <img src={getImageUrl(movie.backdrop_path, "w1280") || "/placeholder.svg"} alt={movie.title} />
          <div className="backdrop-overlay"></div>
        </div>

        <div className="movie-content blurred-backdrop">
          <div className="movie-poster-section">
            <img
              src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
              alt={movie.title}
              className="detail-poster"
            />
          </div>

          <div className="movie-info-section">
            <h1 className="movie-title">{movie.title}</h1>

            <div className="movie-meta">
              <div className="meta-item">
                <Star className="meta-icon" size={16} fill="currentColor" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="meta-item">
                <Calendar className="meta-icon" size={16} />
                <span>{formatDate(movie.release_date)}</span>
              </div>
              {movie.runtime && (
                <div className="meta-item">
                  <Clock className="meta-icon" size={16} />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            <div className="movie-genres">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="movie-description">{movie.overview}</p>

            {cast.length > 0 && (
              <div className="movie-credits">
                <div className="credit-item">
                  <strong>Cast:</strong> {cast.map((actor) => actor.name).join(", ")}
                </div>
              </div>
            )}

            <div className="movie-actions">
              <button className="btn btn-primary" onClick={() => setShowTrailer(true)}>
                <Play size={20} fill="currentColor" />
                Watch Now
              </button>

              <button
                className={`btn btn-heart favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={() => toggleFavorite(movie.id)}
              >
                <Heart size={20} fill={isFavorite ? "red" : "none"} />
                {isFavorite ? "Added" : "Add to List"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {similarMovies.length > 0 && (
        <div className="related-section">
          <div className="container">
            <h2 className="section-title">More Like This</h2>
            <div className="related-grid">
              {similarMovies.map((relatedMovie) => (
                <MovieCard
                  key={relatedMovie.id}
                  movie={relatedMovie}
                  type="movie"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {showTrailer && (
        <TrailerModal
          id={movie.id}
          type="movie"
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  )
}

export default MovieDetail
