import React from "react"
import SeriesCard from "../components/SeriesCard"
import type { SeriesGridProps } from "../types/movie"
import "./SeriesGrid.css"

const SeriesGrid = ({ title, series }: SeriesGridProps): React.ReactElement => {
  if (!series) {
    return (
      <section className="series-grid-section">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <p className="loading-text">Loading...</p>
        </div>
      </section>
    )
  }

  if (series.length === 0) {
    return (
      <section className="series-grid-section">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <p className="empty-text">No results found.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="series-grid-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="series-grid">
          {series.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SeriesGrid
