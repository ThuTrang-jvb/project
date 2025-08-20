import React, { useEffect, useState } from "react"
import Hero from "../components/Hero"
import MovieGrid from "../components/MovieGrid"
import { movieService } from "../services/movieService"
import type { Movie } from "../types/movie"
import { useFavorites } from "../context/FavoritesContext"   
import "./HomePage.css" 

const HomePage = (): React.ReactElement => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useFavorites()

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          movieService.getTrendingMovies(),
          movieService.getPopularMovies(),
          movieService.getTopRatedMovies(),
          movieService.getUpcomingMovies(),
        ])

        setTrendingMovies(trending.slice(0, 12))
        setPopularMovies(popular.slice(0, 12))
        setTopRatedMovies(topRated.slice(0, 12))
        setUpcomingMovies(upcoming.slice(0, 12))
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return (
      <div className="home-page loading-screen">
        <div className="spinner"></div>
        <p>Loading movies...</p>
      </div>
    )
  }

  return (
    <div className="home-page">
      <Hero />

      {trendingMovies.length > 0 && (
        <MovieGrid 
          title="Trending Now" 
          movies={trendingMovies} 
          layout="scroll" 
          loading={loading}
        />
      )}
      {popularMovies.length > 0 && (
        <MovieGrid 
          title="Popular Movies" 
          movies={popularMovies} 
          layout="scroll" 
          loading={loading}
        />
      )}
      {topRatedMovies.length > 0 && (
        <MovieGrid 
          title="Top Rated" 
          movies={topRatedMovies} 
          layout="scroll" 
          loading={loading}
        />
      )}
      {upcomingMovies.length > 0 && (
        <MovieGrid 
          title="Coming Soon" 
          movies={upcomingMovies} 
          layout="scroll" 
          loading={loading}
        />
      )}
    </div>
  )
}

export default HomePage
