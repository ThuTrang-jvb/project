import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { Country } from "../types/movie"
import "./CountryDropdown.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryDropdown = (): React.ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const isCountry = location.pathname.startsWith("/country")

  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasNavigated, setHasNavigated] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`)
      const data = await response.json()
      setCountries(data)
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Reset navigation flag when countries change
    setHasNavigated(false)
  }, [selectedCountries])

  useEffect(() => {
    if (!location.pathname.startsWith("/country")) {
      setHasNavigated(false)
    } else {
      setDropdownOpen(false)
      setSearchTerm("")
    }
  }, [location.pathname])

  const toggleCountry = (country: Country) => {
    const isSelected = selectedCountries.some(c => c.iso_3166_1 === country.iso_3166_1)
    if (isSelected) {
      setSelectedCountries(selectedCountries.filter(c => c.iso_3166_1 !== country.iso_3166_1))
    } else {
      setSelectedCountries([...selectedCountries, country])
    }
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedCountries.length > 0 && !hasNavigated) {
      const query = selectedCountries.map(c => c.iso_3166_1).join(",")
      navigate(`/country?codes=${query}`)
      setHasNavigated(true)
    }
  }

  const filteredCountries = countries.filter(c =>
    c.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.native_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.iso_3166_1.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button
        className={`country-button ${isCountry ? "active" : ""}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Country
      </button>

      {dropdownOpen && (
        <div className="country-grid-panel">
          <input
            className="country-search-input"
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus
          />

          <div className="country-list-scroll">
            {filteredCountries.map(country => (
              <div
                key={country.iso_3166_1}
                className={`country-box ${
                  selectedCountries.some(c => c.iso_3166_1 === country.iso_3166_1) ? "selected" : ""
                }`}
                onClick={() => toggleCountry(country)}
              >
                {country.english_name} ({country.iso_3166_1})
              </div>
            ))}
          </div>

          <div className="country-hint">Press Enter to search</div>
        </div>
      )}
    </div>
  )
}

export default CountryDropdown
