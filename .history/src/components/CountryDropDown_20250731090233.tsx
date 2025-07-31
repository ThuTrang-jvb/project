import React, { useEffect, useState, useRef, useMemo } from "react"
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
  const inputRef = useRef<HTMLInputElement>(null)

  const isCountryPage = location.pathname.startsWith("/country")

  // Fetch country list once
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (dropdownOpen && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [dropdownOpen])

  // Reset dropdown state on route change
  useEffect(() => {
    if (!location.pathname.startsWith("/country")) {
      // reset chọn quốc gia khi rời khỏi trang country nếu muốn
    } else {
      // chỉ đóng dropdown, không reset chọn quốc gia
      setDropdownOpen(false)
      setSearchTerm("")
    }
  }, [location.pathname])

  // Toggle selected country
  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev =>
      prev.includes(countryCode)
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    )
  }

  // Handle Enter to navigate
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedCountries.length > 0) {
      const query = selectedCountries.join(",")
      const newUrl = `/country?code=${query}`
      if (location.pathname + location.search !== newUrl) {
        navigate(newUrl)
      }
    }
  }

  // Filter countries by search term
  const filteredCountries = useMemo(() =>
    countries.filter((country) =>
      `${country.english_name} ${country.native_name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ), [countries, searchTerm])

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button
        className={`country-button ${isCountryPage ? "active" : ""}`}
        onClick={() => setDropdownOpen(prev => !prev)}
      >
        Country
      </button>

      {dropdownOpen && (
        <div className="country-grid-panel">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="country-search-input"
          />

          <div className="country-list-scroll">
            {filteredCountries.slice(0, 50).map((country) => {
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
