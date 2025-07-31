"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Country, Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import { movieService } from "../services/movieService" // Import movieService
import "./CountryPage.css"

const CountryPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const countryCodes = searchParams.get("code")?.split(",") || []
  const [movies, setMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchCountriesAndMovies = async () => {
      setMoviesLoading(true)
      setCountriesLoading(true)
      try {
        const [countryList, moviesByCountry] = await Promise.all([
          movieService.getCountries(),
          movieService.getMoviesByCountry(countryCodes.join(",")),
        ])

        if (!cancelled) {
          setCountries(countryList)
          setMovies(moviesByCountry)
        }
      } catch (err) {
        console.error("Failed to fetch data for country page:", err)
        if (!cancelled) {
          setCountries(movieService.getMockCountries()) // Fallback to mock countries
          setMovies(movieService.getMockMoviesByCountry(countryCodes.join(","))) // Fallback to mock movies
        }
      } finally {
        if (!cancelled) {
          setMoviesLoading(false)
          setCountriesLoading(false)
        }
      }
    }

    if (countryCodes.length === 0) {
      setMovies([])
      setMoviesLoading(false)
      setCountriesLoading(false)
      return
    }

    fetchCountriesAndMovies()

    return () => {
      cancelled = true
    }
  }, [countryCodes])

  const getTitle = () => {
    if (countryCodes.length === 0) return "No country selected"
    const matched = countries.filter((c) => countryCodes.includes(c.iso_3166_1))
    if (matched.length === 0) return "Movies from selected countries"

    return (
      "Movies from " +
      matched
        .map((c) => {
          return c.native_name && c.native_name !== c.english_name
            ? `${c.english_name} (${c.native_name})`
            : c.english_name
        })
        .join(", ")
    )
  }

  const isLoading = moviesLoading || countriesLoading

  return (
    <div className="country-movie-list">
      <h2>{getTitle()}</h2>
      {isLoading ? (
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
