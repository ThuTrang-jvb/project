import MovieCard from "./MovieCard"
import type { MovieGridProps } from "../types/movie"
import "./MovieGrid.css"
import type React from "react"

const MovieGrid = ({ title, movies }: MovieGridProps): React.ReactElement => {
  return (
    <section className="movie-grid-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MovieGrid
