import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { movieService } from "../services/movieService";
import type { Series } from "../types/movie";
import "./SeriesDetailPage.css";

const SeriesDetailPage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const data = await movieService.getSeriesDetails(Number(id));
          setSeries(data);
        }
      } catch (err) {
        console.error("Failed to fetch series detail", err);
      }
    };
    fetchDetail();
  }, [id]);

  if (!series) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="series-detail">
      <img
        src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
        alt={series.name}
        className="series-detail-poster"
      />
      <div className="series-detail-info">
        <h1>{series.name}</h1>
        <p><strong>First Air Date:</strong> {series.first_air_date}</p>
        <p><strong>Rating:</strong> ⭐ {series.vote_average}</p>
        <p><strong>Overview:</strong> {series.overview}</p>
      </div>
    </div>
  );
};

export default SeriesDetailPage;
