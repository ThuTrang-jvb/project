import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { Country } from "../types/movie"
import "./CountryDropDown.css"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryDropDown = (): React.ReactElement => {
  const [countries, setCountries] = useState<Country[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const activeCode = new URLSearchParams(location.search).get("code")

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

  const handleSelect = (code: string) => {
    navigate(`/country?code=${code}`)
  }

  return (
    <div className="country-scroll-container">
      <div className="country-scroll-bar">
        {countries.map((country) => (
          <button
            key={country.iso_3166_1}
            className={`country-pill ${country.iso_3166_1 === activeCode ? "active" : ""}`}
            onClick={() => handleSelect(country.iso_3166_1)}
          >
            {country.english_name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CountryDropDown
