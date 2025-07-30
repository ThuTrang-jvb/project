import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Movie, Genre } from "../types/movie"
import "./GenrePage.css"
import { Star } from "lucide-react"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const GenrePage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const genreIds = searchParams.get("ids")?.split(",") || []
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [genresMap, setGenresMap] = useState<Record<string, string>>({})

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
        const genreParam = genreIds.join(",")
        const res = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreParam}`
        )
        const data = await res.json()
        setMovies(data.results)
      } catch (error) {
        console.error("Failed to load genre movies:", error)
      } finally {
        setLoading(false)
      }
    }

    if (genreIds.length > 0) {
      fetchMoviesByGenre()
    }
  }, [genreIds])

  const genreNames = genreIds
    .map((id) => genresMap[id])
    .filter((name) => name) 

  return (
    <div className="genre-movie-list">
      <h2>
        {genreNames.length > 0
          ? `${genreNames.join(", ")}`
          : "No genres selected"}
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                    : "/placeholder.svg"
                }
                alt={movie.title}
              />
              <h4>{movie.title}</h4>
              <div className="">
                <Star className="meta-icon" size={16} fill="currentColor" />
                <p>{movie.vote_average}</p>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GenrePage
