import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import SkeletonMovieCard from "../components/SkeletonMovieCard"
import ""
import "./GenrePage.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const SearchPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query") || ""

  const [movies, setMovies] = useState<Movie[]>([])
  const [pendingMovies, setPendingMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [isOverlayVisible, setOverlayVisible] = useState(false)

  useEffect(() => {
    if (moviesLoading) {
      setOverlayVisible(true)
    } else {
      const timeout = setTimeout(() => setOverlayVisible(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [moviesLoading])

  useEffect(() => {
    let cancelled = false

    const fetchMoviesBySearch = async () => {
      if (!query.trim()) {
        setMovies([])
        setPendingMovies([])
        return
      }

      setMoviesLoading(true)
      try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (!cancelled) {
          setPendingMovies(data.results || [])
        }
      } catch (err) {
        console.error("Failed to search movies:", err)
      } finally {
        if (!cancelled) setMoviesLoading(false)
      }
    }

    fetchMoviesBySearch()

    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    if (!moviesLoading) {
      setMovies(pendingMovies)
    }
  }, [moviesLoading])

  const getTitle = () => {
    return query.trim() ? `Search results for "${query}"` : "Search"
  }

  return (
    <div className="genre-movie-list" style={{ position: "relative", minHeight: "80vh" }}>
      <h2>{getTitle()}</h2>

      {isOverlayVisible && movies.length === 0 && (
        <div className="movie-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      )}

      {!isOverlayVisible && movies.length === 0 && (
        <p style={{ color: "#ccc", padding: "1rem" }}>No results found.</p>
      )}

      {movies.length > 0 && (
        <MovieGrid title="" movies={movies} />
      )}
    </div>
  )
}

export default SearchPage
