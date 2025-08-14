import React, { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { Play, Plus, Star, Calendar } from "lucide-react"
import { movieService } from "../services/movieService"
import { getImageUrl, formatDate } from "../config/api"
import type { Series, Cast } from "../types/movie"
import "./SeriesDetailPage.css"

const SeriesDetailPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>()
  const [series, setSeries] = useState<Series | null>(null)
  const [cast, setCast] = useState<Cast[]>([])
  const [similarSeries, setSimilarSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSeriesData = async (): Promise<void> => {
      if (!id) return

      try {
        const seriesId = Number.parseInt(id)
        const [seriesDetails, seriesCast, similar] = await Promise.all([
          movieService.getSeriesDetails(seriesId),
          movieService.getSeriesCast(seriesId),
          movieService.getSimilarSeries(seriesId),
        ])

        setSeries(seriesDetails)
        setCast(seriesCast.slice(0, 5))
        setSimilarSeries(similar.slice(0, 8))
      } catch (error) {
        console.error("Error fetching series details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeriesData()
  }, [id])

  if (loading) {
    return (
      <div className="series-detail">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading series details...</p>
        </div>
      </div>
    )
  }

  if (!series) {
    return (
      <div className="series-detail">
        <div className="error-container">
          <h2>Series not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="series-detail">
      <div className="series-hero">
        <div className="series-backdrop">
          <img src={getImageUrl(series.backdrop_path, "w1280") || "/placeholder.svg"} alt={series.name} />
          <div className="backdrop-overlay"></div>
        </div>

        <div className="series-content blurred-backdrop">
          <div className="series-poster-section">
            <img
              src={getImageUrl(series.poster_path) || "/placeholder.svg"}
              alt={series.name}
              className="detail-poster"
            />
          </div>

          <div className="series-info-section">
            <h1 className="series-title">{series.name}</h1>

            <div className="series-meta">
              <div className="meta-item">
                <Star className="meta-icon" size={16} fill="currentColor" />
                <span>{series.vote_average != null ? series.vote_average.toFixed(1) : "N/A"}</span>
              </div>
              <div className="meta-item">
                <Calendar className="meta-icon" size={16} />
                <span>{formatDate(series.first_air_date)}</span>
              </div>
            </div>

            {series.genre_ids && (
              <div className="series-genres">
                {series.genre_ids.map((genreId) => (
                  <span key={genreId} className="genre-tag">
                    {genreId}
                  </span>
                ))}
              </div>
            )}

            <p className="series-description">{series.overview}</p>

            {cast.length > 0 && (
              <div className="series-credits">
                <div className="credit-item">
                  <strong>Cast:</strong> {cast.map((actor) => actor.name).join(", ")}
                </div>
              </div>
            )}

            <div className="series-actions">
              <button className="btn btn-primary">
                <Play size={20} fill="currentColor" />
                Watch Now
              </button>
              <button className="btn btn-secondary">
                <Plus size={20} />
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {similarSeries.length > 0 && (
        <div className="related-section">
          <div className="container">
            <h2 className="section-title">More Like This</h2>
            <div className="related-grid">
              {similarSeries.map((related) => (
                <Link
                  key={related.id}
                  to={`/series/${related.id}`}
                  className="related-card"
                >
                  <img
                    src={getImageUrl(related.poster_path) || "/placeholder.svg"}
                    alt={related.name}
                  />
                  <div className="related-info">
                    <h3>{related.name}</h3>
                    <div className="related-rating">
                      <Star size={12} fill="currentColor" />
                      {related.vote_average != null ? related.vote_average.toFixed(1) : "N/A"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeriesDetailPage
