import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./GenreDropdown.css"

const genres = [
    {"id": 28, "name": "Action"},
    {"id": 12, "name": "Adventure"},
    {"id": 16, "name": "Animation"},
    {"id": 35, "name": "Comedy"},
    {"id": 80,"name": "Crime"},
    {"id": 99, "name": "Documentary"},
    {"id": 18,"name": "Drama"},
    {"id": 10751,"name": "Family"},
    {"id": 14,"name": "Fantasy"},
    {"id": 36, "name": "History"},
    {"id": 27, "name": "Horror"},
    {"id": 10402, "name": "Music"},
    {"id": 9648, "name": "Mystery"},
    {"id": 10749, "name": "Romance"},
    {"id": 878, "name": "Science Fiction"},
    {"id": 10770, "name": "TV Movie"},
    {"id": 53, "name": "Thriller"},
    {"id": 10752, "name": "War"},
    {"id": 37, "name": "Western"}
]

const GenreDropdown = (): React.ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const isGenre = location.pathname.startsWith("/genre")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id)
        ? prev.filter((genreId) => genreId !== id)
        : [...prev, id]
    )
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && selectedGenres.length > 0) {
      const query = selectedGenres.join(",")
      navigate(`/genre?ids=${query}`)
      setIsOpen(false)
      setSelectedGenres([])
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, selectedGenres])

  return (
    <div className="genre-dropdown" ref={dropdownRef}>
      <button
        className={`genre-button nav-link ${isGenre ? "active" : ""}`}
        onClick={toggleDropdown}
      >
        Genres 
      </button>

      {isOpen && (
        <div className="genre-grid-panel">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className={`genre-box ${selectedGenres.includes(genre.id) ? "selected" : ""}`}
              onClick={() => toggleGenre(genre.id)}
            >
              {genre.name}
            </div>
          ))}
          <div className="genre-hint">Press <b>Enter</b> to search</div>
        </div>
      )}
    </div>
  )
}

export default GenreDropdown
