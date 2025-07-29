import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

interface Country {
  iso_3166_1: string
  english_name: string
  native_name: string
}

const Country = (): React.ReactElement | null => {
  const location = useLocation()
  const [countries, setCountries] = useState<Country[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/configuration/countries?api_key=${import.meta.env.VITE_TMDB_API_KEY}"
        )
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error("Error fetching countries:", error)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  if (!location.pathname.startsWith("/country")) return null

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="country-button">
        Country
      </button>
      {isOpen && (
        <ul className="country-list">
          {countries.map((country) => (
            <li key={country.iso_3166_1}>
              {country.english_name} ({country.iso_3166_1})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Country
