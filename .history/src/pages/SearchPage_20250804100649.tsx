import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { movieService } from "../services/movieService"
import type { Movie } from "../types/movie"
import "./SearchBar.css"

const fallbackImage =
  "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-4c38c8f20c3a2a2524cba6be144df78e13bc4c98a497f78f9345025c8f93b68b.svg"

const SearchBar = (): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      try {
        const results = await movieService.searchMovies(query)
        setSearchResults(results.slice(0, 5))
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.length > 2) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
      setSearchResults([]) // Ẩn dropdown khi nhấn Enter
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([])
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="search-container no-inline-style" ref={searchRef}>
      <input
        type="text"
        placeholder="Search movies..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Search className="search-icon" size={20} />
      {isSearching && <div className="search-loading">Searching...</div>}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              className="search-result-item"
              onClick={() => {
                navigate(`/movie/${movie.id}`)
                setSearchResults([]) // Ẩn dropdown khi chọn bằng chuột
              }}
            >
              <img
                src={movie.poster_path
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : fallbackImage}
                alt={movie.title}
                className="search-result-poster"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage
                }}
              />
              <div className="search-result-info">
                <h4>{movie.title}</h4>
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
