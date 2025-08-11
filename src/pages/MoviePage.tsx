import React, { useEffect, useState } from "react"
import { movieService } from "../services/movieService"
import MovieGrid from "../components/MovieGrid"
import type { Movie } from "../types/movie"

const MoviePage = (): React.ReactElement => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchMovies(1) // load page đầu tiên
  }, [])

  const fetchMovies = async (pageToLoad: number) => {
    try {
      if (pageToLoad === 1) setLoading(true)
      else setLoadMoreLoading(true)

      const data = await movieService.getAllMovies(pageToLoad)
      const safeData: Movie[] = Array.isArray(data) ? data : []

      // Nếu trả về ít hơn 20 phim thì nghĩa là hết dữ liệu
      if (safeData.length < 20) {
        setHasMore(false)
      }

      // Loại bỏ trùng ID
      setMovies(prevMovies => {
        const combined = [...prevMovies, ...safeData]
        return combined.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        )
      })

      setPage(pageToLoad)
    } catch (err) {
      console.error("Failed to fetch movies", err)
    } finally {
      setLoading(false)
      setLoadMoreLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (hasMore) {
      fetchMovies(page + 1)
    }
  }

  if (loading && page === 1) {
    return <div className="loading-container">Loading all movies...</div>
  }

  return (
    <div className="container">
      <MovieGrid title="" movies={movies} />
      {hasMore && (
        <div
          className="load-more-wrapper"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <button
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={loadMoreLoading}
          >
            {loadMoreLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
}

export default MoviePage
