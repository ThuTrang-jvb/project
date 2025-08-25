import { useEffect, useState } from "react"
import { useFavorites } from "../context/FavoritesContext"
import { movieService } from "../services/movieService"
import MovieCard from "../components/MovieCard"
import SeriesCard from "../components/SeriesCard"
import type { Movie, Series } from "../types/movie"
import "./HistoryPage.css"

type MediaItem = (Movie | Series) & { media_type: "movie" | "tv" }

const HistoryPage: React.FC = () => {
  const { favorites } = useFavorites()
  const [favoriteItems, setFavoriteItems] = useState<MediaItem[]>([])
  const [watchedItems, setWatchedItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"favorites" | "watched">("favorites")

  // Lấy danh sách Favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteItems([])
        return
      }

      setLoading(true)
      try {
        const items = await Promise.all(
          favorites.map(async (id) => {
            try {
              const movie = await movieService.getMovieDetails(id)
              return { ...movie, media_type: "movie" as const }
            } catch {
              try {
                const tv = await movieService.getSeriesDetails(id)
                return { ...tv, media_type: "tv" as const }
              } catch {
                return null
              }
            }
          })
        )
        setFavoriteItems(items.filter((i) => i !== null) as MediaItem[])
      } catch (err) {
        console.error("Failed to fetch favorites:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [favorites])

  // Lấy danh sách Watched
  useEffect(() => {
    const fetchWatched = async () => {
      const watchedIds: number[] = JSON.parse(localStorage.getItem("watched") || "[]")
      if (watchedIds.length === 0) {
        setWatchedItems([])
        return
      }

      setLoading(true)
      try {
        const items = await Promise.all(
          watchedIds.map(async (id) => {
            try {
              const movie = await movieService.getMovieDetails(id)
              return { ...movie, media_type: "movie" as const }
            } catch {
              try {
                const tv = await movieService.getSeriesDetails(id)
                return { ...tv, media_type: "tv" as const }
              } catch {
                return null
              }
            }
          })
        )
        setWatchedItems(items.filter((i) => i !== null) as MediaItem[])
      } catch (err) {
        console.error("Failed to fetch watched items:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWatched()
  }, [])

  if (loading) return <p>Loading...</p>

  const itemsToShow = tab === "favorites" ? favoriteItems : watchedItems

  return (
    <div className="history-page">
      <div className="history-buttons">
        <button
          onClick={() => setTab("favorites")}
          className={tab === "favorites" ? "active" : ""}
        >
          Favorites
        </button>
        <button
          onClick={() => setTab("watched")}
          className={tab === "watched" ? "active" : ""}
        >
          Watched
        </button>
      </div>

      <div className="history-grid">
        {itemsToShow.length === 0 ? (
          <p>{tab === "favorites" ? "No favorites yet." : "No watched videos yet."}</p>
        ) : (
          itemsToShow.map((item) =>
            item.media_type === "movie" ? (
              <MovieCard key={`movie-${item.id}`} movie={item as Movie} />
            ) : (
              <SeriesCard key={`tv-${item.id}`} series={item as Series} />
            )
          )
        )}
      </div>
    </div>
  )
}

export default HistoryPage
