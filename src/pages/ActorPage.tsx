import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { movieService } from "../services/movieService";
import type { Actor, CombinedCredits, CreditItem, Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import SkeletonMovieCard from "../components/SkeletonMovieCard";
import "./ActorPage.css";

export default function ActorPage() {
  const { id } = useParams<{ id: string }>();
  const actorId = Number(id);

  const [actor, setActor] = useState<Actor | null>(null);
  const [movieCredits, setMovieCredits] = useState<CombinedCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actorId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const actorData: Actor = await movieService.getActorDetails(actorId);
        setActor(actorData);

        const creditsData: CombinedCredits =
          await movieService.getActorCombinedCredits(actorId);
        setMovieCredits(creditsData);
      } catch (err) {
        console.error("Error fetching actor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actorId]);

  const uniqueMovies: CreditItem[] = Array.from(
    new Map(movieCredits?.cast?.map((m) => [m.id, m])).values()
  );

  const convertToMovie = (credit: CreditItem): Movie => {
    const c = credit as Partial<Movie>; 
    return {
      id: credit.id,
      title: (credit as any).title || (credit as any).name || "",
      original_title: (credit as any).original_title || (credit as any).title || "",
      poster_path: (credit as any).poster_path || "",
      backdrop_path: c.backdrop_path ?? "",
      overview: c.overview ?? "",
      release_date:
        (credit as any).release_date || (credit as any).first_air_date || "",
      vote_average: c.vote_average ?? 0,
      vote_count: c.vote_count ?? 0,
      adult: c.adult ?? false,
      genre_ids: c.genre_ids ?? [],
      original_language: c.original_language ?? "en",
      popularity: c.popularity ?? 0,
      video: c.video ?? false
    };
  };

  return (
    <div className="actor-page">
      {actor && (
        <div className="actor-header">
          {actor.profile_path && (
            <img
              className="actor-image"
              src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
              alt={actor.name}
            />
          )}
          <div className="actor-info">
            <h1>{actor.name}</h1>
            <p><strong>Birthday:</strong> {actor.birthday || "N/A"}</p>
            <p><strong>Place of Birth:</strong> {actor.place_of_birth || "N/A"}</p>
            <p>{actor.biography || "No biography available."}</p>
          </div>
        </div>
      )}

      <h2>Known For</h2>
      <div className="movie-list">
        {loading
          ? Array.from({ length: 20 }).map((_, idx) => (
              <SkeletonMovieCard key={idx} />
            ))
          : uniqueMovies.slice(0, 20).map((credit) => {
              const movieData = convertToMovie(credit);
              return <MovieCard key={movieData.id} movie={movieData} />;
            })}
      </div>
    </div>
  );
}
