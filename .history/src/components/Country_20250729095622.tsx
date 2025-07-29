import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import "../components/Country.css"

interface Country {
  iso_3166_1: string
  english_name: string
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY 

const CountryDropdown = (): React.ReactElement => {
  const location = useLocation()
  const isCountry = location.pathname.startsWith("/country")

  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/configuration/countries?api_key=${API_KEY}`)
        const data = await res.json()
        const sorted = data.sort((a: Country, b: Country) =>
          a.english_name.localeCompare(b.english_name)
        )
        setCountries(sorted)
      } catch (err) {
        console.error("Error fetching countries from TMDB:", err)
      }
    }

    fetchCountries()
  }, [])

  const toggleDropdown = () => setIsOpen((prev) => !prev)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return isCountry ? (
    <div className="country-dropdown" ref={dropdownRef}>
      <button className="country-button" onClick={toggleDropdown}>
        🌍 Select a Country
      </button>
      {isOpen && (
        <ul className="country-list">
          {countries.map((country) => (
            <li key={country.iso_3166_1} className="country-item">
              {country.english_name} ({country.iso_3166_1})
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : <></>
}

export default CountryDropdown
