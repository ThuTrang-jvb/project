import React from "react";
import MovieCard from "./MovieCard";
import type { Movie } from "../types/movie";
import "./MovieGrid.css";

interface MovieGridProps {
  title: string;
  movies: Movie[];
}

const MovieGrid = ({ title, movies }: MovieGridProps): React.ReactElement => {
  if (!movies) {
    return (
      <section className="movie-grid-section">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <p className="loading-text">Loading...</p>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return (
      <section className="movie-grid-section">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <p className="empty-text">No results found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="movie-grid-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.id}-${index}`} movie={movie} />
          ))}

        </div>
      </div>
    </section>
  );
};

export default MovieGrid;
