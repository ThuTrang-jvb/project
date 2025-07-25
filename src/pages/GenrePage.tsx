import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
 
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
 
interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
}
 
const GenrePage = (): React.ReactElement => {
  const { id } = useParams()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}`
        )
        console.log(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${id}`)

        const data = await res.json()
        setMovies(data.results)
      } catch (error) {
        console.error("Failed to load genre movies:", error)
      } finally {
        setLoading(false)
      }
    }
 
    fetchMoviesByGenre()
  }, [id])
 
  return (
    <div className="genre-movie-list">
      <h2>Movies in genre ID: {id}</h2>
      {loading ? (
        <p>Loading...</p>
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
              <p>{movie.release_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
 
export default GenrePage