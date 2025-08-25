import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { movieService } from "../services/movieService"
import "./SearchBar.css"

const SearchBar = (): React.ReactElement => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      setIsSearching(true)
      try {
        const results = await movieService.searchMulti(query)
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
      setSearchResults([])
      setSearchQuery("") 
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
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        placeholder="Search movies, series, actors..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Search className="search-icon" size={20} />
      {isSearching && <div className="search-loading">Searching...</div>}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((item) => (
            <div
              key={`${item.media_type}-${item.id}`}
              className="search-result-item"
              onClick={() => {
                if (item.media_type === "movie") navigate(`/movie/${item.id}`)
                else if (item.media_type === "tv") navigate(`/series/${item.id}`)
                else if (item.media_type === "person") navigate(`/actor/${item.id}`)
                setSearchResults([])
                setSearchQuery("") 
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  item.poster_path || item.profile_path
                    ? `https://image.tmdb.org/t/p/w92${item.poster_path || item.profile_path}`
                    : "/placeholder.svg"
                }
                alt={item.title || item.name}
                className="search-result-poster"
              />
              <div className="search-result-info">
                <h4>{item.title || item.name}</h4>
                {item.media_type === "movie" && item.release_date && (
                  <span>{new Date(item.release_date).getFullYear()}</span>
                )}
                {item.media_type === "tv" && item.first_air_date && (
                  <span>{new Date(item.first_air_date).getFullYear()}</span>
                )}
                {item.media_type === "person" && <span>Actor</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
