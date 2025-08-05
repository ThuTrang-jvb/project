import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Movie, Genre } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import SkeletonMovieCard from "../components/SkeletonMovieCard"
import "./GenrePage.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const GenrePage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const genreIds = searchParams.get("ids")?.split(",") || []
  const [movies, setMovies] = useState<Movie[]>([])
  const [pendingMovies, setPendingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [isOverlayVisible, setOverlayVisible] = useState(false)
  const [genresMap, setGenresMap] = useState<Record<string, string>>({})

  useEffect(() => {
    if (loading) {
      setOverlayVisible(true)
    } else {
      const timeout = setTimeout(() => setOverlayVisible(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [loading])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
        const data = await res.json()
        const map: Record<string, string> = {}
        data.genres.forEach((genre: Genre) => {
          map[genre.id.toString()] = genre.name
        })
        setGenresMap(map)
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        setLoading(true)
        const genreParam = genreIds.join(",")
        const res = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreParam}`
        )
        const data = await res.json()
        setPendingMovies(data.results || [])
      } catch (error) {
        console.error("Failed to load genre movies:", error)
        setPendingMovies([])
      } finally {
        setLoading(false)
      }
    }

    if (genreIds.length > 0) {
      fetchMoviesByGenre()
    } else {
      setMovies([])
      setPendingMovies([])
      setLoading(false)
    }
  }, [genreIds])

  useEffect(() => {
    if (!loading) {
      setMovies(pendingMovies)
    }
  }, [loading])

  const genreNames = genreIds.map((id) => genresMap[id]).filter((name) => name)

  return (
    <div className="genre-movie-list" style={{ position: "relative", minHeight: "80vh" }}>
      <h2>{genreNames.length > 0 ? genreNames.join(", ") : "Movies by genre"}</h2>

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

export default GenrePage
