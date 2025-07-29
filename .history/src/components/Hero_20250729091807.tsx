import { useEffect, useState, useRef } from "react"
import { Play, Plus, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate } from "../config/api"
import type { Movie } from "../types/movie"
import "./Hero.css"

const AUTO_SLIDE_INTERVAL = 20000 // 20 giây

const Hero = (): React.ReactElement => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trending = await movieService.getTrendingMovies()
        setMovies(trending.slice(0, 5)) // lấy top 5 phim
      } catch (err) {
        console.error("Error loading movies", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  useEffect(() => {
    // bắt đầu chuyển động tự động
    startAutoSlide()

    return () => {
      stopAutoSlide()
    }
  }, [movies])

  const startAutoSlide = () => {
    stopAutoSlide()
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    }, AUTO_SLIDE_INTERVAL)
  }

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handlePrev = () => {
    stopAutoSlide()
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    )
    startAutoSlide()
  }

  const handleNext = () => {
    stopAutoSlide()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    startAutoSlide()
  }

  if (loading) {
    return <section className="hero"><div className="hero-loading">Loading...</div></section>
  }

  if (movies.length === 0) {
    return <section className="hero"><div className="hero-error">No movies found</div></section>
  }

  const movie = movies[currentIndex]

  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src={getImageUrl(movie.backdrop_path, "w1280") || "/placeholder.svg"}
          alt={movie.title}
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

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

        <div className="hero-navigation">
          <button className="nav-btn left" onClick={handlePrev}><ChevronLeft size={32} /></button>
          <button className="nav-btn right" onClick={handleNext}><ChevronRight size={32} /></button>
        </div>
      </div>
    </section>
  )
}

export default Hero
