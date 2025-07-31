"use client"

import type React from "react"
import { useEffect, useRef, useState, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { movieService } from "../services/movieService" // Import movieService
import "./CountryDropDown.css"

interface Country {
  iso_3166_1: string
  english_name: string
  native_name?: string
}

const CountryDropdown = (): React.ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const isCountry = location.pathname.startsWith("/country")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const toggleCountry = (code: string) => {
    setSelectedCountries((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && selectedCountries.length > 0) {
      const query = selectedCountries.join(",")
      navigate(`/country?code=${query}`)
      setIsOpen(false)
      setSelectedCountries([])
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countryList = await movieService.getCountries()
        setCountries(countryList)
      } catch (error) {
        console.error("Failed to fetch countries:", error)
        // Fallback to mock data is handled by movieService
      }
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
      document.addEventListener("mousedown", handleClickOutside)
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, selectedCountries])

  useEffect(() => {
    if (!location.pathname.startsWith("/country")) return
    if (!isOpen) {
      setSelectedCountries([])
    }
  }, [location.pathname, isOpen])

  const filteredCountries = useMemo(
    () =>
      countries.filter((country) =>
        `${country.english_name} ${country.native_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [countries, searchTerm],
  )

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button className={`country-button nav-link ${isCountry ? "active" : ""}`} onClick={toggleDropdown}>
        Countries
      </button>

      {isOpen && (
        <div className="country-grid-panel">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            Press <b>Enter</b> to search
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryDropdown
