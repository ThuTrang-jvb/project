export interface Movie {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Genre {
  id: number
  name: string
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path?: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface MovieDetails extends Movie {
  belongs_to_collection?: any
  budget: number
  homepage?: string
  imdb_id?: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  revenue: number
  spoken_languages: SpokenLanguage[]
  status: string
  tagline?: string
  runtime: number                  
  genres: Genre[]                   
}


export interface ProductionCompany {
  id: number
  logo_path?: string
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface MovieCardProps {
  movie: Movie
}

export interface MovieGridProps {
  title: string
  movies: Movie[]
}
