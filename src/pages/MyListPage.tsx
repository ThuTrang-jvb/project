import { useEffect, useState } from "react"
import { getImageUrl, formatDate } from "../config/api"
import type { Movie } from "../types/movie"
import { Play, X } from "lucide-react"
import TrailerModal from "../components/TrailerModal"
import "./MyListPage.css"

const MyListPage = () => {
  const [myList, setMyList] = useState<Movie[]>([])
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("myList")
    if (saved) {
      setMyList(JSON.parse(saved))
    }
  }, [])

  const handleRemove = (id: number) => {
    const updated = myList.filter((m) => m.id !== id)
    setMyList(updated)
    localStorage.setItem("myList", JSON.stringify(updated))
  }

  if (myList.length === 0) {
    return (
      <div className="mylist-page">
        <h2>Your List is Empty</h2>
        <p>Add movies to your list and they’ll appear here!</p>
      </div>
    )
  }

  return (
    <div className="mylist-page">
      <h2 className="mylist-title">My List</h2>
      <div className="mylist-grid">
        {myList.map((movie) => (
          <div key={movie.id} className="mylist-card">
            <img
              src={getImageUrl(movie.poster_path, "w500")}
              alt={movie.title}
              className="mylist-poster"
            />
            <div className="mylist-info">
              <h3>{movie.title}</h3>
              <p>{formatDate(movie.release_date)}</p>
              <div className="mylist-actions">
                <button onClick={() => setSelectedMovieId(movie.id)}>
                  <Play size={18} />
                  Trailer
                </button>
                <button onClick={() => handleRemove(movie.id)}>
                  <X size={18} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMovieId && (
        <TrailerModal
          id={selectedMovieId}
          type="movie"
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  )
}

export default MyListPage
