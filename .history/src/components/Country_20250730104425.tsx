import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { Country } from "../types/movie"
import "./CountryDropdown.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryDropdown = (): React.ReactElement => {
  const [countries, setCountries] = useState<Country[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
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

  const handleSelect = (countryCode: string) => {
    navigate(`/country?code=${countryCode}`)
    setDropdownOpen(false)
  }

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button className="country-button" onClick={() => setDropdownOpen((prev) => !prev)}>
        {isCountryPage ? "Change Country" : "Select Country"}
      </button>
      {dropdownOpen && (
        <ul className="country-list">
          {countries.map((country) => (
            <li
              key={country.iso_3166_1}
              onClick={() => handleSelect(country.iso_3166_1)}
              className="country-item"
            >
              {country.english_name} ({country.native_name || country.iso_3166_1})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CountryDropdown
