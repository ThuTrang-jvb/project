// SeriesCard.tsx
import React from "react";
import type { Series } from "../types/movie";
import { useNavigate } from "react-router-dom";
import "./SeriesCard.css";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps): React.ReactElement => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/series/${series.id}`);
  };

  return (
    <div className="series-card" onClick={handleClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
        alt={series.name}
        className="series-poster"
      />
      <div className="series-info">
        <h3 className="series-title">{series.name}</h3>
        <p className="series-date">{series.first_air_date}</p>
        <p className="series-rating">⭐ {series.vote_average}</p>
      </div>
    </div>
  );
};

export default SeriesCard;
