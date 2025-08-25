import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./TrailerModal.css";

interface TrailerModalProps {
  id: number;
  type: "movie" | "tv";
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ id, type, onClose }) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("No trailer found yet...");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&language=en-US`
        );
        const data = await res.json();
        console.log("Videos from TMDB:", data.results);

        if (data.results && data.results.length > 0) {
          const trailer = data.results.find(
            (v: any) => v.type === "Trailer" && v.site === "YouTube"
          );
          const fallback = data.results.find((v: any) => v.site === "YouTube");
          const key = trailer ? trailer.key : fallback ? fallback.key : null;
          setTrailerKey(key);
          setLoadingMessage("");
        } else {
          setTrailerKey(null);
        }
      } catch (err) {
        console.error("Error fetching trailer:", err);
        setTrailerKey(null);
      }
    };

    fetchTrailer();

    timer = setTimeout(() => {
      if (!trailerKey) {
        setLoadingMessage("Trailer not found.");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, type]);

  return (
    <div className="trailer-modal" onClick={onClose}>
      <button className="close-btn" onClick={onClose}>
        <X size={28} />
      </button>

      {!trailerKey ? (
        <div className="trailer-message" onClick={(e) => e.stopPropagation()}>
          <p>{loadingMessage}</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TrailerModal;
