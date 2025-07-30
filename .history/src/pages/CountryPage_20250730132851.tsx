import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const countryCode = searchParams.get("code")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMoviesByCountry = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&region=${countryCode}`
        )
        const data = await res.json()
        setMovies(data.results)
      } catch (error) {
        console.error("Failed to fetch movies by country:", error)
      } finally {
        setLoading(false)
      }
    }

    if (countryCode) {
      fetchMoviesByCountry()
    }
  }, [countryCode])

  return (
    <div className="country-movie-list">
      <h2>
        {countryCode ? `Movies from ${countryCode}` : "No country selected"}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <MovieGrid title="" movies={movies} />
      )}
    </div>
  )
}

export default CountryPage
