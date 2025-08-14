import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { Bell, Menu } from "lucide-react"
import GenreDropdown from "../components/GenreDropdown"
import Country from "../components/CountryDropDown"
import SearchBar from "../components/SearchBar"
import LoginModal from "../components/LoginModal"

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
      <header className={`header ${isShrunk ? "shrink" : ""} ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="header-container">
          <div className="header-left">
            <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
              <a href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</a>
              <GenreDropdown />
              <Country />
              <Link to="/movies/single" className={`nav-link ${isActive("/movies/single") ? "active" : ""}`}>
                Movie
              </Link>
              <Link to="/series" className={`nav-link ${isActive("/movies/single") ? "active" : ""}`}>
                Series
              </Link>
              <a href="/animation" className={`nav-link ${isActive("/animation") ? "active" : ""}`}>Actor</a>
            </nav>
          </div>

          <div className="header-center">
            <div className="search-wrapper">
              <SearchBar />
            </div>
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>

          <div className="header-right">
            <Bell className="header-icon" size={12} />
          </div>

          <div>
            <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
              <button
                type="button"
                className={`nav-link ${isActive("/login") ? "active" : ""}`}
                onClick={() => setIsLoginOpen(true)}
              >
                Login/Signup
              </button>
            </nav>
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}

export default Header
