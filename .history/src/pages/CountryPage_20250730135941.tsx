import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Country, Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import "./GenrePage.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const countryCodes = searchParams.get("codes")?.split(",") || []
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`)
        const data: Country[] = await res.json()
        setCountries(data)
      } catch (err) {
        console.error("Failed to fetch countries:", err)
      }
    }

    const fetchMoviesByCountry = async () => {
      try {
        const regionParam = countryCodes.join(",")
        const res = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=${regionParam}&sort_by=popularity.desc`
        )
        const data = await res.json()
        setMovies(data.results || [])
      } catch (err) {
        console.error("Failed to fetch movies:", err)
      } finally {
        setLoading(false)
      }
    }

    if (countryCodes.length > 0) {
      fetchCountries()
      fetchMoviesByCountry()
    }
  }, [countryCodes])

  const getTitle = () => {
    if (countries.length === 0 || countryCodes.length === 0) return "No country selected"

    const matchedNames = countryCodes
      .map((code) => countries.find((c) => c.iso_3166_1 === code))
      .filter(Boolean)
      .map((country) =>
        country!.native_name && country!.native_name !== country!.english_name
          ? `${country!.english_name} (${country!.native_name})`
          : country!.english_name
      )

    return `Movies from ${matchedNames.join(", ")}`
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