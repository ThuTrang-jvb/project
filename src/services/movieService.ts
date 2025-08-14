import { API_CONFIG } from "../config/api"
import type { Movie, Series, TMDBResponse, MovieDetails, Cast, Video, Genre, Actor, CombinedCredits } from "../types/movie"

class MovieService {
  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    const separator = endpoint.includes("?") ? "&" : "?"
    const url = `${API_CONFIG.BASE_URL}${endpoint}${separator}api_key=${API_CONFIG.API_KEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("API fetch error:", error)
      throw error
    }
  }
  async getAllMovies(page: number = 1): Promise<Movie[]> {
    const endpoint = `/discover/movie?page=${page}&language=en-US`
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>(endpoint)
    return response.results
  }

  async getTrendingMovies(): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>("/trending/movie/week")
    return response.results
  }

  async getPopularMovies(page = 1): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>(`/movie/popular?page=${page}`)
    return response.results
  }

  async getTopRatedMovies(): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>("/movie/top_rated")
    return response.results
  }

  async getUpcomingMovies(): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>("/movie/upcoming")
    return response.results
  }

  async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>(`/discover/movie?with_genres=${genreId}`)
    return response.results
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return await this.fetchFromAPI<MovieDetails>(`/movie/${movieId}`)
  }

  async getMovieCast(movieId: number): Promise<Cast[]> {
    const response = await this.fetchFromAPI<{ cast: Cast[] }>(`/movie/${movieId}/credits`)
    return response.cast
  }

  async getMovieVideos(movieId: number): Promise<Video[]> {
    const response = await this.fetchFromAPI<{ results: Video[] }>(`/movie/${movieId}/videos`)
    return response.results
  }

  async getSimilarMovies(movieId: number): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>(`/movie/${movieId}/similar`)
    return response.results
  }

  async searchMovies(query: string): Promise<Movie[]> {
    const encodedQuery = encodeURIComponent(query)
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>(`/search/movie?query=${encodedQuery}`)
    return response.results
  }

  async getGenres(): Promise<Genre[]> {
    const response = await this.fetchFromAPI<{ genres: Genre[] }>("/genre/movie/list")
    return response.genres
  }

  async getNowPlayingMovies(): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>("/movie/now_playing")
    return response.results
  }

  async getAllSeries(page = 1): Promise<Series[]> {
    const endpoint = `/discover/tv?page=${page}&language=en-US`
    const response = await this.fetchFromAPI<TMDBResponse<Series>>(endpoint)
    return response.results
  }

  async getSeriesDetails(seriesId: number): Promise<Series> {
    return await this.fetchFromAPI<Series>(`/tv/${seriesId}`)
  }

  async getSeriesCast(seriesId: number): Promise<Cast[]> {
    const response = await this.fetchFromAPI<{ cast: Cast[] }>(`/tv/${seriesId}/credits`)
    return response.cast
  }

  async getSimilarSeries(seriesId: number): Promise<Series[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Series>>(`/tv/${seriesId}/similar`)
    return response.results
  }

  async searchSeries(query: string): Promise<Series[]> {
    const encodedQuery = encodeURIComponent(query)
    const response = await this.fetchFromAPI<TMDBResponse<Series>>(`/search/tv?query=${encodedQuery}`)
    return response.results
  }
  async getMoviesByActor(actorId: number, page: number = 1): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>(
      `/discover/movie?with_cast=${actorId}&page=${page}`
    );
    return response.results;
  }
  async getActorDetails(id: number): Promise<Actor> {
    return await this.fetchFromAPI<Actor>(`/person/${id}?language=en-US`);
  }

  async getActorCombinedCredits(id: number): Promise<CombinedCredits> {
    return await this.fetchFromAPI<CombinedCredits>(`/person/${id}/combined_credits?language=en-US`);
  }
  async searchMulti(query: string) {
    const encodedQuery = encodeURIComponent(query)
    const response = await this.fetchFromAPI<{ results: any[] }>(`/search/multi?query=${encodedQuery}`)
    return response.results
  }
}

export const movieService = new MovieService()
