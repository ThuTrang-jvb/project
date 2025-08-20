import { useEffect, useState } from "react"
import { Play, Heart, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate } from "../config/api"
import type { Movie } from "../types/movie"
import TrailerModal from "./TrailerModal"
import { useFavorites } from "../context/FavoritesContext"  
import { useNavigate } from "react-router-dom"             
import "./Hero.css"

const AUTO_SLIDE_INTERVAL = 20000

const Hero = (): React.ReactElement => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)

  const { favorites, toggleFavorite } = useFavorites()
  const navigate = useNavigate() 

  useEffect(() => {
    const fetchMovies = async () => {
      const trending = await movieService.getTrendingMovies()
      setMovies(trending.slice(0, 5))
    }
    fetchMovies()
  }, [])

  useEffect(() => {
    if (movies.length === 0) return
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % movies.length),
      AUTO_SLIDE_INTERVAL
    )
    return () => clearInterval(interval)
  }, [movies])

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % movies.length)

  const handleWatchNow = () => {
    const current = movies[currentIndex]
    if (!current) return
    setSelectedMovieId(current.id)
    setIsTrailerOpen(true)
  }

  const handleToggleFavorite = () => {
    const current = movies[currentIndex]
    if (!current) return
    toggleFavorite(current.id)
  }

  const handleMoreInfo = () => {
    const current = movies[currentIndex]
    if (!current) return
    navigate(`/movie/${current.id}`)
  }

  const movie = movies[currentIndex]
  const isFavorite = movie ? favorites.includes(movie.id) : false

  if (!movie) {
    return (
      <section className="hero">
        <div className="hero-loading">Loading...</div>
      </section>
    )
  }

  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src={getImageUrl(movie.backdrop_path, "w1280")}
          alt={movie.title}
          className="hero-image"
        />
        <div className="hero-overlay" />
      </div>
      <button className="hero-arrow left" onClick={prevSlide}>
        <ChevronLeft size={32} />
      </button>
      <button className="hero-arrow right" onClick={nextSlide}>
        <ChevronRight size={32} />
      </button>

      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{movie.title}</h1>
          <p className="hero-description">
            {movie.overview || "An amazing movie experience awaits you."}
          </p>

          <div className="hero-meta">
            <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
            <span className="year">{formatDate(movie.release_date)}</span>
            <span className="genre">Action, Adventure</span>
          </div>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleWatchNow}>
              <Play size={20} fill="currentColor" />
              Watch Now
            </button>

            <button
              className={`btn btn-heart ${isFavorite ? "active" : ""}`}
              onClick={handleToggleFavorite}
            >
              <Heart
                size={20}
                fill={isFavorite ? "red" : "none"}
                color={isFavorite ? "red" : "currentColor"}
              />
              {isFavorite ? "Added" : "Add to List"}
            </button>

            <button className="btn btn-info" onClick={handleMoreInfo}>
              <Info size={20} />
              More Info
            </button>
          </div>
        </div>
      </div>

      {isTrailerOpen && selectedMovieId && (
        <TrailerModal
          id={selectedMovieId}
          type="movie"
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </section>
  )
}

export default Hero
