import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Country, Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import "./GenrePage.css" // dùng lại CSS của GenrePage

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const countryCode = searchParams.get("code") || ""
  console.log("[CountryPage] countryCode from URL:", countryCode)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [country, setCountry] = useState<Country | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=${countryCode}&sort_by=popularity.desc`)
        const data: Country[] = await res.json()
        console.log("[CountryPage] Fetched countries:", data)
        const match = data.find((c) => c.iso_3166_1 === countryCode)
        setCountry(match || null)
      } catch (err) {
        console.error("Failed to fetch countries:", err)
      }
    }

    const fetchMoviesByCountry = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&region=${countryCode}`
        )
        const data = await res.json()
        setMovies(data.results || [])
      } catch (err) {
        console.error("Failed to fetch movies:", err)
      } finally {
        setLoading(false)
      }
    }

    if (countryCode) {
      fetchCountries()
      fetchMoviesByCountry()
    }
  }, [countryCode])

  const getTitle = () => {
    if (!country) return "No country selected"
    if (country.native_name && country.native_name !== country.english_name) {
      return `Movies from ${country.english_name} (${country.native_name})`
    }
    return `Movies from ${country.english_name}`
  }

  return (
    <div className="genre-movie-list">
      <h2>{getTitle()}</h2>
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
