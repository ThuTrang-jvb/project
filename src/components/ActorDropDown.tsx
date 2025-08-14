import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./ActorDropdown.css"
import type { Actor, KnownFor } from "../types/movie"

type ActorDropdownProps = {}

const ActorDropdown: React.FC<ActorDropdownProps> = () => {
  const [actors, setActors] = useState<Actor[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const IMAGE_BASE = "https://image.tmdb.org/t/p/w45"

  const fetchPopularActors = async () => {
    setLoading(true)
    try {
      const promises = [1, 2, 3].map((page) =>
        fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=${page}`).then(
          (res) => res.json(),
        ),
      )

      const results = await Promise.all(promises)
      const allActors = results.flatMap((data) => data.results || [])
      setActors(allActors.slice(0, 50))
    } catch (err) {
      console.error("Error fetching popular actors:", err)
      setActors([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (actor: Actor) => {
    setIsOpen(false)
    navigate(`/actor/${actor.id}`)
  }

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchPopularActors()
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="actor-dropdown" ref={dropdownRef}>
      <div className="dropdown-label nav-link" onClick={toggleDropdown}>
        Actor
      </div>
      {isOpen && (
        <>
          {loading && <div className="dropdown-loading">Loading top 50 actors...</div>}
          {!loading && actors.length > 0 && (
            <ul className="dropdown-list">
              {actors.map((actor, index) => (
                <li key={actor.id} onClick={() => handleSelect(actor)}>
                  {actor.profile_path && (
                    <img src={`${IMAGE_BASE}${actor.profile_path}`} alt={actor.name} className="actor-img" />
                  )}
                  <div className="actor-info">
                    <strong>{actor.name}</strong>
                    {actor.known_for?.length > 0 && (
                      <div className="movies">
                        {actor.known_for
                          .map((m: KnownFor) => m.title || m.name)
                          .filter(Boolean)
                          .slice(0, 2) 
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!loading && actors.length === 0 && <div className="no-results">No results found</div>}
        </>
      )}
    </div>
  )
}

export default ActorDropdown
