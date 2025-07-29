import React, { useState, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import "../components/Country.css"

interface Country {
  iso_3166_1: string
  english_name: string
  native_name: string
}

const CountryDropdown = (): React.ReactElement => {
  const location = useLocation()
  const isCountry = location.pathname.startsWith("/country")

  const [isOpen, setIsOpen] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const data = await response.json()

        const formattedCountries: Country[] = data.map((item: any) => ({
          iso_3166_1: item.cca2,
          english_name: item.name.common,
          native_name: Object.values(item.name.nativeName || {})[0]?.common || item.name.common,
        }))

        // Sắp xếp theo tên tiếng Anh
        formattedCountries.sort((a, b) => a.english_name.localeCompare(b.english_name))
        setCountries(formattedCountries)
      } catch (error) {
        console.error("Failed to fetch countries:", error)
      }
    }

    fetchCountries()
  }, [])

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

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
              {country.english_name} ({country.native_name})
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : <></>
}

export default CountryDropdown
