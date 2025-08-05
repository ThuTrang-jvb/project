import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Search, Bell, Menu } from "lucide-react"
import { movieService } from "../services/movieService"
import GenreDropdown from "../components/GenreDropdown"
import Country from "../components/CountryDropDown"
import SearchBar from "../components/SearchBar"
import type { Movie } from "../types/movie"
import "./Header.css"

const Header = (): React.ReactElement => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isShrunk, setIsShrunk] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = async (query: string) => {
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

  const isActive = (path: string) => location.pathname === path

  return (
    <header className={`header ${isShrunk ? "shrink" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <a href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</a>
            <GenreDropdown />
            <Country />
          </nav>
        </div>

        <div className="header-center">
          <SearchBar />
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>

        <div className="header-right">
          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <a href="/movies" className={`nav-link ${isActive("/movies") ? "active" : ""}`}>Movies</a>
            <a href="/series" className={`nav-link ${isActive("/series") ? "active" : ""}`}>Series</a>
            <a href="/animation" className={`nav-link ${isActive("/animation") ? "active" : ""}`}>Animation</a>
          </nav>
        </div>

        <div>
          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <a href="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>Login/Signup</a>
          </nav>
        </div>

        <Bell className="header-icon" size={12} />
      </div>
    </header>
  )
}

export default Header
