import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { movieService } from "../services/movieService"
import type { Movie } from "../types/movie"
import "./SearchBar.css"

const SearchBar = (): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const navigate = useNavigate()

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

  return (
    <div className="search-container">
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
              style={{ cursor: "pointer" }}
            >
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "/placeholder.svg"}
                alt={movie.title}
                className="search-result-poster"
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
