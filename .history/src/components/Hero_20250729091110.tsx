import { useEffect, useState } from "react"
import { Play, Plus, Info } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate } from "../config/api"
import type { Movie } from "../types/movie"
import "./Hero.css"

const Hero = (): React.ReactElement => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchFeaturedMovies = async (): Promise<void> => {
      try {
        const trendingMovies = await movieService.getTrendingMovies()
        setFeaturedMovies(trendingMovies.slice(0, 5)) // chỉ lấy 5 phim đầu
      } catch (error) {
        console.error("Error fetching featured movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMovies()
  }, [])


  if (loading) {
    return (
      <section className="hero">
        <div className="hero-loading">Loading...</div>
      </section>
    )
  }

  if (!featuredMovies) {
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
          <p className="hero-description">{featuredMovie.overview || "An amazing movie experience awaits you."}</p>
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
