import React, { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import type { Movie } from "../types/movie"
import MovieGrid from "../components/MovieGrid"
import SkeletonMovieCard from "../components/SkeletonMovieCard"
import "./Searchpage.css"
import "./GenrePage.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const SearchPage = (): React.ReactElement => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query") || ""
  const navigate = useNavigate()
  const [movies, setMovies] = useState<Movie[]>([])
  const [actors, setActors] = useState<any[]>([]) 
  const [pendingMovies, setPendingMovies] = useState<Movie[]>([])
  const [pendingActors, setPendingActors] = useState<any[]>([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [isOverlayVisible, setOverlayVisible] = useState(false)

  const [activeTab, setActiveTab] = useState<"movies" | "actors">("movies") 

  useEffect(() => {
    if (moviesLoading) {
      setOverlayVisible(true)
    } else {
      const timeout = setTimeout(() => setOverlayVisible(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [moviesLoading])

  useEffect(() => {

    const fetchBySearch = async () => {
      if (!query.trim()) {
        setMovies([])
        setActors([])
        setPendingMovies([])
        setPendingActors([])
        return
      }

      setMoviesLoading(true)
      try {
        const resMovies = await fetch(
          `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        )
        const dataMovies = await resMovies.json()

        const movieResults: Movie[] = (dataMovies.results || [])
          .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
          .map((item: any) => ({
            id: item.id,
            title: item.title || item.name,
            poster_path: item.poster_path,
            vote_average: item.vote_average,
            release_date: item.release_date || item.first_air_date,
            overview: item.overview,
          }))
        const resActors = await fetch(
          `${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        )
        const dataActors = await resActors.json()

        const actorResults = dataActors.results || []

        setPendingMovies(movieResults)
        setPendingActors(actorResults)
      } catch (err) {
        console.error("Failed to search:", err)
      } finally {
        setMoviesLoading(false)
      }
    }


    fetchBySearch()

    return () => {
    }
  }, [query])

  useEffect(() => {
    if (!moviesLoading) {
      setMovies(pendingMovies)
      setActors(pendingActors)
    }
  }, [moviesLoading])

  const getTitle = () => {
    return query.trim() ? `Search results for "${query}"` : "Search"
  }

  return (
    <div className="genre-movie-list full-height">
      <h2>{getTitle()}</h2>
      <div className="search-tabs">
        <button
          className={activeTab === "movies" ? "active" : ""}
          onClick={() => setActiveTab("movies")}
        >
          Movies & Series
        </button>
        <button
          className={activeTab === "actors" ? "active" : ""}
          onClick={() => setActiveTab("actors")}
        >
          Actors
        </button>
      </div>

      {isOverlayVisible && movies.length === 0 && actors.length === 0 && (
        <div className="movie-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      )}

      {!isOverlayVisible && movies.length === 0 && actors.length === 0 && (
        <p className="no-results-text">No results found.</p>
      )}

      {activeTab === "movies" && movies.length > 0 && (
        <MovieGrid title="" movies={movies} />
      )}

      {activeTab === "actors" && actors.length > 0 && (
        <div className="actor-grid">
          {actors.map((actor) => (
            <div key={actor.id} className="actor-card" onClick={() => navigate(`/actor/${actor.id}`)}>
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "https://via.placeholder.com/185x278?text=No+Image"
                }
                alt={actor.name}
              />

              <h4>{actor.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
