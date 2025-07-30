import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import MovieGrid from "../components/MovieGrid"
import type { Movie, OCun } from "../types/movie"
import type { Country } from "../types/c"
import "./CountryPage.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const countryCode = searchParams.get("code") || ""
  const [movies, setMovies] = useState<Movie[]>([])
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`)
        const data: Country[] = await res.json()
        const matched = data.find((c) => c.iso_3166_1 === countryCode)
        setCountry(matched || null)
      } catch (error) {
        console.error("Failed to fetch countries:", error)
      }
    }

    const fetchMovies = async () => {
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
      fetchCountries()
      fetchMovies()
    }
  }, [countryCode])

  return (
    <div className="country-movie-list">
      <h2>
        {country
          ? `Movies from ${country.english_name} (${country.native_name})`
          : "No country selected"}
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
