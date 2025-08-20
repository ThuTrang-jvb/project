import React, { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { Play, Plus, Star, Clock, Calendar } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate, formatRuntime } from "../config/api"
import type { MovieDetails, Cast, Movie } from "../types/movie"
import "./MovieDetail.css"


const MovieDetail = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [cast, setCast] = useState<Cast[]>([])
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)

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
        console.log("Backdrop URL:", getImageUrl(movieDetails.backdrop_path, "w1280"))
        console.log("Backdrop path:", movieDetails.backdrop_path)

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
              <button className="btn btn-primary">
                <Play size={20} fill="currentColor" />
                Watch Now
              </button>
              <button className="btn btn-secondary">
                <Plus size={20} />
                Add to List
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
                <Link
                  key={relatedMovie.id}
                  to={`/movie/${relatedMovie.id}`}
                  className="related-card"
                >
                  <img
                    src={getImageUrl(relatedMovie.poster_path) || "/placeholder.svg"}
                    alt={relatedMovie.title}
                  />
                  <div className="related-info">
                    <h3>{relatedMovie.title}</h3>
                    <p className="movie-date">{movie.release_date}</p>
                    <div className="related-rating">
                      <Star size={12} fill="currentColor" />
                      {relatedMovie.vote_average.toFixed(1)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetail
