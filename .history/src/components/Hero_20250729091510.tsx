import { useEffect, useState, useRef } from "react"
import { Play, Plus, Info } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate } from "../config/api"
import type { Movie } from "../types/movie"
import "./Hero.css"

const AUTO_SLIDE_INTERVAL = 10000 

const Hero = (): React.ReactElement => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trendingMovies = await movieService.getTrendingMovies()
        setMovies(trendingMovies.slice(0, 5)) 
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  useEffect(() => {
    if (movies.length > 0) {
      startAutoSlide()
    }
    return stopAutoSlide
  }, [movies])

  const startAutoSlide = () => {
    stopAutoSlide()
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, AUTO_SLIDE_INTERVAL)
  }

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-loading">Loading...</div>
      </section>
    )
  }

  const featuredMovie = movies[currentIndex]

  if (!featuredMovie) {
    return (
      <section className="hero">
        <div className="hero-error">Unable to load featured movie</div>
      </section>
    )
  }

  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src={getImageUrl(featuredMovie.backdrop_path, "w1280") || "/placeholder.svg"}
          alt={featuredMovie.title}
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{featuredMovie.title}</h1>
          <p className="hero-description">
            {featuredMovie.overview || "An amazing movie experience awaits you."}
          </p>
          <div className="hero-meta">
            <span className="rating">★ {featuredMovie.vote_average.toFixed(1)}</span>
            <span className="year">{formatDate(featuredMovie.release_date)}</span>
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
