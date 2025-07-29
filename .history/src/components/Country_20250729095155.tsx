import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./GenreDropdown.css"

type Genre = {
  id: number
  name: string
}

const GenreDropdown = (): React.ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const isGenre = location.pathname.startsWith("/genre")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
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
    const fetchGenres = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`)
        const data = await res.json()
        setGenres(data.genres)
      } catch (err) {
        console.error("Failed to fetch genres", err)
      }
    }

    fetchGenres()
  }, [])

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
