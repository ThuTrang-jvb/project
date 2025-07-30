import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { Country } from "../types/movie"
import "./CountryDropdown.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryDropdown = (): React.ReactElement => {
  const [countries, setCountries] = useState<Country[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isCountryPage = location.pathname.startsWith("/country")

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`)
        const data = await res.json()
        setCountries(data)
      } catch (err) {
        console.error("Failed to fetch countries:", err)
      }
    }

    fetchCountries()
  }, [])
  const dropdownPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dropdownOpen && dropdownPanelRef.current) {
      dropdownPanelRef.current.focus()
    }
  }, [dropdownOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  const toggleCountry = (countryCode: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    )
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedCountries.length > 0) {
      const query = selectedCountries.join(",")
      navigate(`/country?code=${query}`)
    }
  }




  const filteredCountries = countries.filter((country) =>
    `${country.english_name} ${country.native_name || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button
        className={`country-button ${isCountryPage ? "active" : ""}`}
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        Country
      </button>

      {dropdownOpen && (
        <div
          className="country-grid-panel"
          onKeyDown={handleKeyDown}
          tabIndex={0} 
        >

          <input
            type="text"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="country-search-input"
          />
          <div className="country-list-scroll">
            {filteredCountries.map((country) => {
              const isSelected = selectedCountries.includes(country.iso_3166_1)
              return (
                <div
                  key={country.iso_3166_1}
                  className={`country-box ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleCountry(country.iso_3166_1)}
                >
                  {country.english_name}
                  {country.native_name && country.native_name !== country.english_name
                    ? ` (${country.native_name})`
                    : ""}
                </div>
              )
            })}
          </div>
          <div className="country-hint">
            Select one or more countries and press <b>Enter</b> to search
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryDropdown
