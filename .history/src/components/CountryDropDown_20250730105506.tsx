import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "./CountryDropdown.css"

interface Country {
  iso_3166_1: string
  english_name: string
  native_name: string
}

const CountryDropdown = (): React.ReactElement => {
  const [countries, setCountries] = useState<Country[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isCountryPage = location.pathname.startsWith("/country")

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://api.themoviedb.org/3/configuration/countries?api_key=YOUR_API_KEY")
      const data = await res.json()
      setCountries(data)
    }
    fetchCountries()
  }, [])

  const toggleDropdown = () => setDropdownOpen((prev) => !prev)

  const handleSelect = (iso: string) => {
    setDropdownOpen(false)
    setSearchTerm("")
    navigate(`/country/${iso}`)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredCountries = countries.filter((c) =>
    c.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.native_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.iso_3166_1.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button
        className={`country-button ${isCountryPage ? "active" : ""}`}
        onClick={toggleDropdown}
      >
        Quốc gia
      </button>

      {dropdownOpen && (
        <div className="country-grid-panel">
          <input
            type="text"
            placeholder="Tìm kiếm quốc gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="country-search-input"
          />
          <div className="country-list-scroll">
            {filteredCountries.map((country) => (
              <div
                key={country.iso_3166_1}
                className="country-box"
                onClick={() => handleSelect(country.iso_3166_1)}
              >
                {country.english_name} ({country.native_name || country.iso_3166_1})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryDropdown
