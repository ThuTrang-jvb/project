import React, { useRef } from "react"
import MovieCard from "./MovieCard"
import SkeletonMovieCard from "./SkeletonMovieCard"
import type { MovieGridProps } from "../types/movie"   
import "./MovieGrid.css"
import { useFavorites } from "../context/FavoritesContext"  

const MovieGrid: React.FC<MovieGridProps> = ({
  title,
  movies,
  layout = "grid",
  loading = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  useFavorites()  

  const scrollLeft = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      if (scrollLeft <= 0) {
        scrollRef.current.scrollTo({ 
          left: scrollRef.current.scrollWidth, 
          behavior: "smooth" 
        })
      } else {
        scrollRef.current.scrollBy({ left: -clientWidth, behavior: "smooth" })
      }
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({ left: clientWidth, behavior: "smooth" })
      }
    }
  }

  return (
    <section className="movie-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>

        {layout === "scroll" ? (
          <div className="movie-scroll-container">
            <button className="scroll-button scroll-button-left" onClick={scrollLeft}>‹</button>

            <div className="movie-scroll-wrapper" ref={scrollRef}>
              {loading
                ? [...Array(6)].map((_, i) => <SkeletonMovieCard key={i} />)
                : movies.map((m) => (
                    <MovieCard
                      key={m.id}
                      movie={m}
                    />
                  ))}
            </div>

            <button className="scroll-button scroll-button-right" onClick={scrollRight}>›</button>
          </div>
        ) : (
          <div className="movie-grid">
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonMovieCard key={i} />)
              : movies.map((m) => (
                  <MovieCard
                    key={m.id}
                    movie={m}

                  />
                ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MovieGrid
