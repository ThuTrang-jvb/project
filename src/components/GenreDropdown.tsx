import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import "./GenreDropdown.css"

const genres = [
    {"id": 10759, "name": "Action & Adventure"},
    {"id": 16, "name": "Animation"},
    {"id": 35, "name": "Comedy"},
    {"id": 80, "name": "Crime"},
    {"id": 99, "name": "Documentary"},
    {"id": 18, "name": "Drama"},
    {"id": 10751, "name": "Family"},
    {"id": 10762, "name": "Kids"},
    {"id": 9648, "name": "Mystery"},
    {"id": 10763, "name": "News"},
    {"id": 10764, "name": "Reality"},
    {"id": 10765, "name": "Sci-Fi & Fantasy"},
    {"id": 10766, "name": "Soap"},
    {"id": 10767, "name": "Talk"},
    {"id": 10768, "name": "War & Politics"},
    {"id": 37, "name": "Western"}
]

const GenreDropdown = (): React.ReactElement => {
  const location = useLocation()
  const isGenre = location.pathname.startsWith("/genre")
  const [isOpen, setIsOpen] = useState(false)
  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="genre-dropdown">
      <button
        className={`genre-button nav-link ${isGenre ? "active" : ""}`}
        onClick={toggleDropdown}
      >
        Genre
      </button>
      {isOpen && (
        <div className="genre-grid-panel">
          {genres.map((genre) => (
            <a key={genre.id} href={`/genre/${genre.id}`} className="genre-grid-item">
              {genre.name}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default GenreDropdown
