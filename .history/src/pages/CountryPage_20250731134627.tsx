import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Country, Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import "./GenrePage.css"
import SkeletonMovieCard from "../components/SkeletonMovieCard"


const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const countryCodes = searchParams.get("code")?.split(",") || []

  const [movies, setMovies] = useState<Movie[]>([])
  const [pendingMovies, setPendingMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [isOverlayVisible, setOverlayVisible] = useState(false)

  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)

  // Overlay loading không bị chớp
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

    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`)
        const data: Country[] = await res.json()
        if (!cancelled) setCountries(data)
      } catch (err) {
        console.error("Failed to fetch countries:", err)
      } finally {
        if (!cancelled) setCountriesLoading(false)
      }
    }

    const fetchMoviesByCountry = async (code: string): Promise<Movie[]> => {
      try {
        const res = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=${code}&sort_by=popularity.desc`
        )
        const data = await res.json()
        return data.results || []
      } catch (err) {
        console.error(`Failed to fetch movies for country ${code}:`, err)
        return []
      }
    }

    const fetchAllMovies = async () => {
      setMoviesLoading(true)
      try {
        const results = await Promise.all(countryCodes.map(fetchMoviesByCountry))
        const merged = results.flat()
        if (!cancelled) setPendingMovies(merged)
      } finally {
        if (!cancelled) setMoviesLoading(false)
      }
    }

    if (countryCodes.length === 0) {
      setMovies([])
      setPendingMovies([])
      setMoviesLoading(false)
      setCountriesLoading(false)
      return
    }

    fetchCountries()
    fetchAllMovies()

    return () => {
      cancelled = true
    }
  }, [countryCodes])

  // Cập nhật phim sau khi tải xong
  useEffect(() => {
    if (!moviesLoading) {
      setMovies(pendingMovies)
    }
  }, [moviesLoading])

  const getTitle = () => {
    if (countryCodes.length === 0) return "No country selected"
    const matched = countries.filter((c) => countryCodes.includes(c.iso_3166_1))
    if (matched.length === 0) return "Movies from selected countries"

    return "Movies from " + matched.map((c) => {
      return c.native_name && c.native_name !== c.english_name
        ? `${c.english_name} (${c.native_name})`
        : c.english_name
    }).join(", ")
  }

  return (
    <div className="genre-movie-list" style={{ position: "relative", minHeight: "80vh" }}>
      <h2>{getTitle()}</h2>

      {/* Loading - chỉ hiển thị nếu chưa có phim */}
      {isOverlayVisible && movies.length === 0 && (
        <p style={{ color: "#fff", padding: "1rem" }}>Loading...</p>
      )}

      {/* Không có kết quả */}
      {!isOverlayVisible && movies.length === 0 && (
        <p style={{ color: "#ccc", padding: "1rem" }}>No results found.</p>
      )}

      {/* Hiển thị phim và overlay nếu đang tải */}
      {movies.length > 0 && (
        <>
          {isOverlayVisible && (
            <div className="loading-overlay">
              <div className="spinner">Loading...</div>
            </div>
          )}
          <MovieGrid title="" movies={movies} />
        </>
      )}
    </div>
  )
}

export default CountryPage
