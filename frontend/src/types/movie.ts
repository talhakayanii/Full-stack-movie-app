// types/movie.ts
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchFilters {
  sortBy: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc';
  year?: number;
  genre?: number;
}

export interface MovieApiParams {
  page?: number;
  query?: string;
  sort_by?: string;
  year?: number;
  with_genres?: number;
}