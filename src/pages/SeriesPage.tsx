import React, { useEffect, useState } from "react";
import { movieService } from "../services/movieService";
import SeriesGrid from "../components/SeriesGrid";
import SkeletonMovieCard from "../components/SkeletonMovieCard";
import type { Series } from "../types/movie";
import "./SeriesPage.css";

const SeriesPage = (): React.ReactElement => {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const fetchSeries = async (page: number) => {
    try {
      const newSeries: Series[] = await movieService.getAllSeries(page);

      setSeriesList(prev => {
        const merged = [...prev, ...newSeries];
        // Lọc trùng theo id
        return merged.filter(
          (item, index, self) => index === self.findIndex(s => s.id === item.id)
        );
      });
    } catch (err) {
      console.error("Failed to fetch series", err);
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchSeries(1);
      setLoading(false);
    };
    loadInitial();
  }, []);

  const handleLoadMore = async () => {
    setLoadMoreLoading(true);
    const nextPage = currentPage + 1;
    await fetchSeries(nextPage);
    setCurrentPage(nextPage);
    setLoadMoreLoading(false);
  };

  return (
    <div className="container">
      {loading ? (
        <div className="movie-grid">
          {Array.from({ length: 20 }).map((_, idx) => (
            <SkeletonMovieCard key={idx} />
          ))}
        </div>
      ) : (
        <>
          <SeriesGrid title="TV Series" series={seriesList} />
          <div className="load-more-wrapper">
            <button
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loadMoreLoading}
            >
              {loadMoreLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SeriesPage;
