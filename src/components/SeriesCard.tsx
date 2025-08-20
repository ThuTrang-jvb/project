import React, { useState } from "react";
import { Play, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Series } from "../types/movie";
import TrailerModal from "./TrailerModal";
import "./SeriesCard.css";

interface SeriesCardProps {
  series: Series;
}

const SeriesCard = ({ series }: SeriesCardProps): React.ReactElement => {
  const navigate = useNavigate();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/series/${series.id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();

    if (action === "play") {
      setIsTrailerOpen(true); 
    } else if (action === "add") {
      console.log(`Added ${series.name} to list`);
    }
  };

  return (
    <>
      <div className="series-card" onClick={handleCardClick}>
        <div className="series-poster">
          <img
            src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
            alt={series.name}
            className="poster-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-4c38c8f20c3a2a2524cba6be144df78e13bc4c98a497f78f9345025c8f93b68b.svg";
            }}
          />

          <div className="series-overlay">
            <button
              className="action-btn play-btn"
              onClick={(e) => handleActionClick(e, "play")}
            >
              <Play size={20} fill="currentColor" />
            </button>
            <button
              className="action-btn add-btn"
              onClick={(e) => handleActionClick(e, "add")}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="series-info">
          <h3 className="series-title">{series.name}</h3>
          <p className="series-date">{series.first_air_date}</p>
          <p className="series-rating">
            <Star size={12} fill="currentColor" /> {series.vote_average.toFixed(2)}
          </p>
        </div>
      </div>

      {isTrailerOpen && (
        <TrailerModal
          id={series.id}
          type="tv"
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </>
  );
};

export default SeriesCard;
