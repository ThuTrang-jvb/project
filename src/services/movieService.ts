import { API_CONFIG } from "../config/api"
import type { Movie, TMDBResponse, MovieDetails, Cast, Video, Genre } from "../types/movie"

class MovieService {
  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}?api_key=${API_CONFIG.API_KEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("API fetch error:", error)
      throw error
    }
  }

  async getTrendingMovies(): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>("/trending/movie/week")
    return response.results
  }

  async getPopularMovies(): Promise<Movie[]> {
    const response = await this.fetchFromAPI<TMDBResponse<Movie>>("/movie/popular")
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
}

export const movieService = new MovieService()
