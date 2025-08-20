import type React from "react"
import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { Menu, Clock, Film } from "lucide-react"
import GenreDropdown from "./GenreDropdown"
import CountryDropdown from "./CountryDropDown"
import SearchBar from "./SearchBar"
import LoginModal from "./LoginModal"
import ActorDropdown from "./ActorDropDown"
import "./Header.css"

const Header = (): React.ReactElement => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShrunk, setIsShrunk] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className={`header ${isShrunk ? "shrink" : ""}`}>
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="logo">
              <Film size={28} className="logo-icon" />
              <span className="logo-text">CinemaFlix</span>
            </Link>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>

          <div className="header-center">
            <div className="search-wrapper">
              <SearchBar />
            </div>
          </div>

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
              Home
            </Link>
            <GenreDropdown />
            <CountryDropdown />
            <Link to="/movies" className={`nav-link ${isActive("/movies") ? "active" : ""}`}>
              Movie
            </Link>
            <Link to="/series" className={`nav-link ${isActive("/series") ? "active" : ""}`}>
              Series
            </Link>
            <ActorDropdown />
            <Link to="/history" className={`nav-link ${isActive("/history") ? "active" : ""}`}>
              <Clock size={12} style={{ marginRight: "4px" }} />
              History
            </Link>
            <button type="button" className="nav-button" onClick={() => setIsLoginOpen(true)}>
              Login/Signup
            </button>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}

export default Header
