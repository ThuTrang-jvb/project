import React, { useEffect, useState } from "react";
import "./TrailerModal.css";

interface TrailerModalProps {
  id: number;
  type: "movie" | "tv";
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ id, type, onClose }) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US`
        );
        const data = await res.json();
        const trailer = data.results.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      } catch (err) {
        console.error("Error fetching trailer:", err);
      }
    };

    fetchTrailer();
  }, [id, type]);

  if (!trailerKey) {
    return (
      <div className="trailer-modal" onClick={onClose}>
        <div className="trailer-message" onClick={(e) => e.stopPropagation()}>
          <p>Không tìm thấy trailer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trailer-modal" onClick={onClose}>
      <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
          title="Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;
