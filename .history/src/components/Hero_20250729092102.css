import { useEffect, useState } from "react"
import { Play, Plus, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate } from "../config/api"
import type { Movie } from "../types/movie"
import "./Hero.css"

const AUTO_SLIDE_INTERVAL = 20000

const Hero = (): React.ReactElement => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const fetchMovies = async () => {
      const trending = await movieService.getTrendingMovies()
      setMovies(trending.slice(0, 5)) // lấy tối đa 5 phim
    }
    fetchMovies()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, AUTO_SLIDE_INTERVAL)
    return () => clearInterval(interval)
  }, [movies])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }

  const movie = movies[currentIndex]

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
        <div className="hero-overlay"></div>
      </div>

      {/* Mũi tên trái */}
      <button className="hero-arrow left" onClick={prevSlide}>
        <ChevronLeft size={32} />
      </button>

      {/* Mũi tên phải */}
      <button className="hero-arrow right" onClick={nextSlide}>
        <ChevronRight size={32} />
      </button>

      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{movie.title}</h1>
          <p className="hero-description">{movie.overview || "An amazing movie experience awaits you."}</p>
          <div className="hero-meta">
            <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
            <span className="year">{formatDate(movie.release_date)}</span>
            <span className="genre">Action, Adventure</span>
          </div>
          <div className="hero-buttons">
            <button className="btn btn-primary">
              <Play size={20} fill="currentColor" />
              Watch Now
            </button>
            <button className="btn btn-secondary">
              <Plus size={20} />
              My List
            </button>
            <button className="btn btn-info">
              <Info size={20} />
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
