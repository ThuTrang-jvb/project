import React, { useState } from "react";
import { Play, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../config/api";
import type { Movie } from "../types/movie";
import TrailerModal from "./TrailerModal";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  type?: "movie" | "tv"; // mặc định là movie
}

const MovieCard = ({ movie, type = "movie" }: MovieCardProps): React.ReactElement => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);

  const handleCardClick = () => {
    navigate(`/${type}/${movie.id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    if (action === "play") {
      setShowTrailer(true);
    } else if (action === "add") {
      console.log(`Added ${movie.title} to list`);
    }
  };

  return (
    <>
      <div className="movie-card" onClick={handleCardClick}>
        <div className="movie-poster">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="poster-image"
          />
          <div className="movie-overlay">
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

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-date">{movie.release_date}</p>
          <p className="movie-rating">
            <Star size={12} fill="currentColor" />{" "}
            {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>

      {showTrailer && (
        <TrailerModal id={movie.id} type={type} onClose={() => setShowTrailer(false)} />
      )}
    </>
  );
};

export default MovieCard;
