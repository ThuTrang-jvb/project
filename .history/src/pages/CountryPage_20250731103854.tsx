import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Country, Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import { useDebounce } from "../hooks/useDebou"
import "./GenrePage.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const rawCodes = searchParams.get("code")?.split(",") || []
  const countryCodes = useDebounce(rawCodes, 500) // ✅ Debounce để tránh gọi API liên tục

  const [movies, setMovies] = useState<Movie[]>([])
  const [moviesLoading, setMoviesLoading] = useState(true)

  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)

  // ✅ Chỉ fetch countries 1 lần
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

    if (countries.length === 0) {
      fetchCountries()
    } else {
      setCountriesLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [])

  // ✅ Gọi phim khi countryCodes đã ổn định sau debounce
  useEffect(() => {
    let cancelled = false

    const fetchMoviesByCountries = async () => {
      if (!cancelled) {
        setMovies([])
        setMoviesLoading(true)
      }

      if (countryCodes.length === 0) {
        if (!cancelled) {
          setMovies([])
          setMoviesLoading(false)
        }
        return
      }

      try {
        const allResults: Movie[] = []
        const pagesToLoad = 1 // tăng lên 2 nếu muốn nhiều kết quả hơn

        for (let page = 1; page <= pagesToLoad; page++) {
          const res = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_origin_country=${countryCodes.join(",")}&sort_by=popularity.desc&language=en-US&page=${page}`
          )
          const data = await res.json()
          if (!cancelled) {
            allResults.push(...(data.results || []))
          }
        }

        if (!cancelled) setMovies(allResults)
      } catch (err) {
        console.error("Failed to fetch movies:", err)
      } finally {
        if (!cancelled) setMoviesLoading(false)
      }
    }

    fetchMoviesByCountries()

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
        .map((c) =>
          c.native_name && c.native_name !== c.english_name
            ? `${c.english_name} (${c.native_name})`
            : c.english_name
        )
        .join(", ")
    )
  }

  const isLoading = moviesLoading || countriesLoading

  return (
    <div className="genre-movie-list">
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
