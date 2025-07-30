import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import type { Country } from "../types/movie"
import "./CountryDropdown.css"

const API_KEY  = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const CountryDropdown = (): React.ReactElement => {
  const [countries, setCountries]           = useState<Country[]>([])
  const [dropdownOpen, setDropdownOpen]     = useState(false)
  const [searchTerm, setSearchTerm]         = useState("")
  const [selectedCountries, setSelected]    = useState<string[]>([])
  const dropdownRef                         = useRef<HTMLDivElement>(null)
  const navigate                            = useNavigate()
  const location                            = useLocation()
  const isCountryPage                       = location.pathname.startsWith("/country")

  /* ───────────────── fetch quốc gia ───────────────── */
  useEffect(() => {
    fetch(`${BASE_URL}/configuration/countries?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error("Failed to fetch countries:", err))
  }, [])

  /* ───── click ngoài đóng dropdown ───── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ───── phím Enter để tìm ───── */
  useEffect(() => {
    if (!dropdownOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedCountries.length) {
        const query = selectedCountries.join(",")
        navigate(`/country?codes=${query}`)
        setDropdownOpen(false)
        setSelected([])
        setSearchTerm("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [dropdownOpen, selectedCountries])

  /* ───────────────── helper ───────────────── */
  const toggleCountry = (code: string) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  const filtered = countries.filter((c) =>
    `${c.english_name} ${c.native_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /* ───────────────── render ───────────────── */
  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button
        className={`country-button ${isCountryPage ? "active" : ""}`}
        onClick={() => setDropdownOpen((o) => !o)}
      >
        Country
      </button>

      {dropdownOpen && (
        <div className="country-grid-panel">
          <input
            className="country-search-input"
            placeholder="Search country…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="country-list-scroll">
            {filtered.map((c) => (
              <div
                key={c.iso_3166_1}
                className={`country-box ${
                  selectedCountries.includes(c.iso_3166_1) ? "selected" : ""
                }`}
                onClick={() => toggleCountry(c.iso_3166_1)}
              >
                {c.english_name}
                {c.native_name && c.native_name !== c.english_name ? ` (${c.native_name})` : ""}
              </div>
            ))}
          </div>
          <div className="country-hint">
            Chọn nhiều quốc gia &nbsp;→&nbsp; nhấn <b>Enter</b> để xem phim
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryDropdown
