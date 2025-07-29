import React, { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../components/Country.css"

interface Country {
  iso_3166_1: string
  english_name: string
  native_name?: string
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const CountryDropdown = (): React.ReactElement => {
  const location = useLocation()
  const navigate = useNavigate()
  const isCountry = location.pathname.startsWith("/country")

  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen((prev) => !prev)

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
        console.error("Error fetching countries:", err)
      }
    }

    fetchCountries()
  }, [])

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

  const handleCountryClick = (countryCode: string) => {
    navigate(`/country/${countryCode}`)
    setIsOpen(false)
  }

  return isCountry ? (
    <div className="country-dropdown" ref={dropdownRef}>
      <button className="country-button" onClick={toggleDropdown}>
        🌍 Select Country
      </button>
      {isOpen && (
        <ul className="country-list">
          {countries.map((country) => (
            <li
              key={country.iso_3166_1}
              className="country-item"
              onClick={() => handleCountryClick(country.iso_3166_1)}
            >
              {country.english_name}
              <span className="native-name">{country.native_name || ""}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : <></>
}

export default CountryDropdown
